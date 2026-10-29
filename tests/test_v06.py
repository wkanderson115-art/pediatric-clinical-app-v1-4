import io
import json
import os
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app, ocr_engine_available
from pathlib import Path

c=TestClient(app)
ROOT=Path(__file__).resolve().parents[1]

def test_v06_clinical_paths_preserved_expanded():
    data=c.get('/api/clinical-education').json()
    names={x['title'] for x in data['clinical_paths']}
    assert len(data['clinical_paths'])>=54
    for s in ['肺炎支原体肺炎','过敏性休克','动物咬伤','烧烫伤','急性胃肠炎','泌尿系感染','头部外伤与轻型脑震荡']:
        assert s in names
    assert len(data['lab_tests'])==155
    assert len(data['examination_terms'])==67
    assert all(x.get('review_status') for x in data['clinical_paths'])

def test_ocr_rejects_without_explicit_consent(monkeypatch):
    monkeypatch.setenv('OCR_ACCESS_CODE','strong-test-code')
    img=io.BytesIO();Image.new('RGB',(200,200),'white').save(img,format='JPEG')
    r=c.post('/api/ocr/recognize',files={'image':('anon.jpg',img.getvalue(),'image/jpeg')}, data={'consent':'no'},headers={'X-OCR-Access':'strong-test-code'})
    assert r.status_code==403

def test_ocr_rejects_missing_access_code(monkeypatch):
    monkeypatch.setenv('OCR_ACCESS_CODE','strong-test-code')
    img=io.BytesIO();Image.new('RGB',(200,200),'white').save(img,format='JPEG')
    r=c.post('/api/ocr/recognize',files={'image':('anon.jpg',img.getvalue(),'image/jpeg')},data={'consent':'yes'},headers={'X-OCR-Access':'wrong'})
    assert r.status_code==403

def test_ocr_rejects_oversize_or_wrong_type(monkeypatch):
    monkeypatch.setenv('OCR_ACCESS_CODE','strong-test-code')
    # Invalid uploads must be rejected before checking whether this host has
    # optional Tesseract language packs installed.
    monkeypatch.setattr('app.main.ocr_engine_available', lambda: False)
    r=c.post('/api/ocr/recognize',files={'image':('anon.txt',b'abcd','text/plain')},data={'consent':'yes'},headers={'X-OCR-Access':'strong-test-code'})
    assert r.status_code==415

def test_ocr_status_public_and_non_sensitive(monkeypatch):
    monkeypatch.setenv('OCR_ACCESS_CODE','test-code-789')
    resp=c.get('/api/ocr/status')
    assert resp.status_code==200
    data=resp.json()
    assert data['requires_explicit_consent'] is True
    assert 'test-code-789' not in resp.text

def test_ocr_in_browser_files_and_offline_precautions():
    html=(ROOT/'web/index.html').read_text()
    js=(ROOT/'web/photo-ocr.js').read_text()
    assert html.count('data-ocr-type=')==2
    assert 'ocr-consent' in html and 'ocr-preview' in html
    assert 'ocr/crop' not in js
    assert "fd.append('consent','yes')" in js
    assert "canvas.toBlob" in js
    assert 'OCR可能' in (ROOT/'app/main.py').read_text()
    assert 'photo-ocr.js' in (ROOT/'web/sw.js').read_text()
