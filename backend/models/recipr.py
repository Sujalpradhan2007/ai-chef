from datetime import datetime
from uuid import uuid4


class Recipe:

    def __init__(
        self,
        name,
        state="",
        district="",
        cuisine="",
        category="",
        ingredients=None,
        steps=None,
        description="",
        prep_time=0,
        cook_time=0,
        servings=1,
        difficulty="Easy",
        photo="",
        video="",
        is_famous=False,
        is_approved=True
    ):

        self.id = str(uuid4())

        self.name = name
        self.state = state
        self.district = district
        self.cuisine = cuisine
        self.category = category

        self.ingredients = ingredients or []
        self.steps = steps or []

        self.description = description

        self.prep_time = prep_time
        self.cook_time = cook_time
        self.servings = servings
        self.difficulty = difficulty

        self.photo = photo
        self.video = video

        self.is_famous = is_famous
        self.is_approved = is_approved

        self.views = 0
        self.likes = 0

        self.created_at = datetime.utcnow().isoformat()
        self.updated_at = datetime.utcnow().isoformat()

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "state": self.state,
            "district": self.district,
            "cuisine": self.cuisine,
            "category": self.category,
            "ingredients": self.ingredients,
            "steps": self.steps,
            "description": self.description,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "servings": self.servings,
            "difficulty": self.difficulty,
            "photo": self.photo,
            "video": self.video,
            "is_famous": self.is_famous,
            "is_approved": self.is_approved,
            "views": self.views,
            "likes": self.likes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }