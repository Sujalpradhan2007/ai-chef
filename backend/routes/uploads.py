"Upload routes compatibility module." ""

from .uplodes import uploads_bp, allowed_file, save_uploaded_file

__all__ = ["uploads_bp", "allowed_file", "save_uploaded_file"]
