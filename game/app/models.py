from django.db import models

class PlayerGame(models.Model):
    player_name = models.CharField(max_length=255)
    game_name = models.CharField(max_length=255)
    score = models.IntegerField()

    def __str__(self):
        return f"{self.player_name} - {self.game_name} - Score: {self.score}"
    
class SnakeScore(models.Model):
    player_name = models.CharField(max_length=255)
    score = models.IntegerField()
    
    def __str__(self):
        return f"{self.player_name} - Score: {self.score}"

class FlappyScore(models.Model):
    player_name = models.CharField(max_length=255)
    score = models.IntegerField()
    
    def __str__(self):
        return f"{self.player_name} - Score: {self.score}"
    
class DinosaurScore(models.Model):
    player_name = models.CharField(max_length=255)
    score = models.IntegerField()
   
    def __str__(self):
        return f"{self.player_name} - Score: {self.score}"
    