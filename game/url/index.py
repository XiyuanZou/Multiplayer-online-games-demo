from django.urls import path, include
from game.views.index import index

urlpatterns = [
        path("", index, name="index"),
        path("menu/", include("game.url.menu.index")),
        path("playground/", include("game.url.playground.index")),
        path("settings/", include("game.url.settings.index")),
]        
