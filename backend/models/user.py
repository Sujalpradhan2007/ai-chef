from datetime import datetime
from uuid import uuid4


class User:

    def __init__(
        self,
        name,
        mobile,
        password_hash="",
        is_admin=False
    ):
        self.id = str(uuid4())
        self.name = name
        self.mobile = mobile
        self.password_hash = password_hash
        self.is_admin = is_admin

        self.status = "active"

        self.created_at = datetime.utcnow().isoformat()
        self.last_login = None

        self.favorite_recipe_ids = []
        self.recipe_history = []
        self.submitted_recipe_count = 0

    def to_dict(self, include_sensitive=False):

        data = {
            "id": self.id,
            "name": self.name,
            "mobile": self.mobile,
            "is_admin": self.is_admin,
            "status": self.status,
            "created_at": self.created_at,
            "last_login": self.last_login,
            "favorite_recipe_ids": self.favorite_recipe_ids,
            "recipe_history": self.recipe_history,
            "submitted_recipe_count": self.submitted_recipe_count
        }

        if include_sensitive:
            data["password_hash"] = self.password_hash

        return data