from django import forms
from .models import PlayerGame
from .models import SnakeScore
from .models import FlappyScore
from .models import DinosaurScore

class PlayerGameForm(forms.ModelForm):
    class Meta:
        model = PlayerGame
        fields = ['player_name', 'game_name', 'score']
       
class SnakeScoreForm(forms.ModelForm):
    class Meta:
        model = SnakeScore
        fields = []

class FlappyScoreForm(forms.ModelForm):
    class Meta:
        model = FlappyScore
        fields = []
        
class DinosaurScoreForm(forms.ModelForm):
    class Meta:
        model = DinosaurScore
        fields = []