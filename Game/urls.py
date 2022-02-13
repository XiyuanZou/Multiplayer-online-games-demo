from django.urls import path
from Game.views import index

urlpatterns = [
    path("", index, name="index"),
]

