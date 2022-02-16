from django.urls import path, include
from Game.views.index import index

urlpatterns = [
        path("", index, name="index")
        path("menu/", include("Game.url.menu.index")),
        path("playground/", include("Game.url.playground.index")),
        path("settings/", include("Game.url.settings.index")),
]        
