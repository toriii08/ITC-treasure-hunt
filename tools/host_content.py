#!/usr/bin/env python3
"""Encrypt / decrypt the host-area content.

The host page (host.html) shows answers, bearings and the runbook. Because the
repository is public, that content is stored encrypted in assets/host.enc.json
and decrypted in the browser with a passcode (AES-256-GCM, key derived with
PBKDF2-SHA256). The plaintext source lives in host_src/host_content.html, which
is git-ignored.

Usage
  python3 tools/host_content.py encrypt            # host_src/host_content.html -> assets/host.enc.json
  python3 tools/host_content.py decrypt            # assets/host.enc.json -> host_src/host_content.html
  python3 tools/host_content.py check              # verify the blob decrypts

The passcode is read from the HOST_PASSCODE environment variable or asked for
interactively. Requires the `cryptography` package (pip install cryptography).
"""
import base64, getpass, json, os, sys
from pathlib import Path

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
except ImportError:
    sys.exit("Install the dependency first:  pip install cryptography")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "host_src" / "host_content.html"
OUT = ROOT / "assets" / "host.enc.json"
ITERATIONS = 200_000


def derive(passcode: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERATIONS)
    return kdf.derive(passcode.encode("utf-8"))


def passcode() -> str:
    return os.environ.get("HOST_PASSCODE") or getpass.getpass("Host passcode: ")


def encrypt() -> None:
    pc = passcode()
    salt, iv = os.urandom(16), os.urandom(12)
    ct = AESGCM(derive(pc, salt)).encrypt(iv, SRC.read_bytes(), None)
    OUT.write_text(json.dumps({
        "kdf": "PBKDF2-SHA256", "iterations": ITERATIONS, "cipher": "AES-256-GCM",
        "salt": base64.b64encode(salt).decode(), "iv": base64.b64encode(iv).decode(),
        "ct": base64.b64encode(ct).decode(),
    }, indent=1))
    print(f"wrote {OUT.relative_to(ROOT)} ({len(ct)} bytes)")


def decrypt_bytes(pc: str) -> bytes:
    blob = json.loads(OUT.read_text())
    salt, iv, ct = (base64.b64decode(blob[k]) for k in ("salt", "iv", "ct"))
    return AESGCM(derive(pc, salt)).decrypt(iv, ct, None)


def decrypt() -> None:
    SRC.parent.mkdir(exist_ok=True)
    SRC.write_bytes(decrypt_bytes(passcode()))
    print(f"wrote {SRC.relative_to(ROOT)}")


def check() -> None:
    decrypt_bytes(passcode())
    print("ok: blob decrypts with this passcode")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    {"encrypt": encrypt, "decrypt": decrypt, "check": check}.get(cmd, lambda: sys.exit(__doc__))()
