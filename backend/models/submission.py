from datetime import datetime
from uuid import uuid4


class RecipeSubmission:

    def __init__(
        self,
        user_id,
        recipe_data
    ):

        self.id = str(uuid4())

        self.user_id = user_id
        self.recipe_data = recipe_data

        self.status = "pending"

        self.admin_note = ""

        self.created_at = datetime.utcnow().isoformat()
        self.reviewed_at = None
        self.reviewed_by = None

    def approve(
        self,
        admin_id,
        note=""
    ):

        self.status = "approved"
        self.admin_note = note
        self.reviewed_by = admin_id
        self.reviewed_at = datetime.utcnow().isoformat()

    def reject(
        self,
        admin_id,
        note=""
    ):

        self.status = "rejected"
        self.admin_note = note
        self.reviewed_by = admin_id
        self.reviewed_at = datetime.utcnow().isoformat()

    def to_dict(self):

        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_data": self.recipe_data,
            "status": self.status,
            "admin_note": self.admin_note,
            "created_at": self.created_at,
            "reviewed_at": self.reviewed_at,
            "reviewed_by": self.reviewed_by
        }