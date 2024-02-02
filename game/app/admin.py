from django.contrib import admin
from .models import PlayerGame, SnakeScore, FlappyScore, DinosaurScore

@admin.register(PlayerGame)
class PlayerGameAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'game_name', 'score')
    ordering = ['score', 'player_name']  

@admin.register(SnakeScore)
class SnakeScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score')
    ordering = ['score', 'player_name']  

@admin.register(FlappyScore)
class FlappyScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score')
    ordering = ['score', 'player_name']  

@admin.register(DinosaurScore)
class DinosaurScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score')
    ordering = ['score', 'player_name'] 