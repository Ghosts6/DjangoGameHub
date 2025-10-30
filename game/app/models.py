from django.db import models
from django.contrib.auth.models import User

class Guest(models.Model):
    guest_name = models.CharField(max_length=100)
    session_key = models.CharField(max_length=40)

    def __str__(self):
        return self.guest_name

class GameScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, null=True, blank=True)
    game = models.CharField(max_length=100)
    score = models.IntegerField()

    def __str__(self):
        if self.user:
            return f'{self.user.username} - {self.game} - {self.score}'
        elif self.guest:
            return f'{self.guest.guest_name} - {self.game} - {self.score}'
        return f'Anonymous - {self.game} - {self.score}'
    