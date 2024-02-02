from django.shortcuts import render ,redirect
from .form import PlayerGameForm
from django.http import JsonResponse
from .models import SnakeScore, FlappyScore, DinosaurScore
from django.http import HttpResponse
from .form import SnakeScoreForm, DinosaurScoreForm , FlappyScoreForm
from django.views.decorators.csrf import csrf_exempt
import json
import os

def home(request, player_name=None):
    if request.method == 'POST':
        form = PlayerGameForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
        elif 'selected_game' in request.POST:
            player_name = request.POST.get('player_name')
            game_name = request.POST.get('selected_game')
            if game_name == 'snake':
                return redirect('Snake_Game', player_name=player_name)
            elif game_name == 'tic_tac':
                return redirect('Tic_Tac_Toe', player_name=player_name)
            elif game_name == 'flappy_bird':
                return redirect('Flappy_Bird', player_name=player_name)
            elif game_name == 'dinosaur':
                return redirect('Dinosaur_Game', player_name=player_name)
    else:
        form = PlayerGameForm()

    return render(request, 'home.html', {'form': form})

def Snake_Game(request, player_name):
    top_scores = SnakeScore.objects.order_by('-score')[:1]
    return render(request, 'snake.html', {'top_scores': top_scores, 'player_name': player_name})


def Flappy_Bird(request, player_name):
    if request.method == 'POST':
        score = int(request.POST.get('score', 0))

        FlappyScore.objects.create(player_name=player_name, score=score)

        return JsonResponse({'message': 'Score submitted successfully'})

    top_score = FlappyScore.objects.order_by('-score').first()
    return render(request, 'flappy_bird.html', {'top_score': top_score})

def Tic_Tac_Toe(request, player_name):
    return render(request, 'tic_tac_toe.html')

def Dinosaur_Game(request, player_name):
    top_score = DinosaurScore.objects.order_by('-score').first()
    return render(request, 'dinosaur_game.html', {'top_score': top_score, 'player_name': player_name})

def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player_name = data.get('player_name')
        score = data.get('score')
        # Save the score to the database
        SnakeScore.objects.create(player_name=player_name, score=score)

        return JsonResponse({'message': 'Score saved successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})

def top_scores(request):
    snake_top_scores = SnakeScore.objects.order_by('-score')[:5]
    flappy_top_scores = FlappyScore.objects.order_by('-score')[:5]
    dinosaur_top_scores = DinosaurScore.objects.order_by('-score')[:5]

    return render(request, 'top_scores.html', {
        'snake_top_scores': snake_top_scores,
        'flappy_top_scores': flappy_top_scores,
        'dinosaur_top_scores': dinosaur_top_scores,
    })

def handle_snake_score_submission(request):
    if request.method == 'POST':
        form = SnakeScoreForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('Score submitted successfully!')
    
    return HttpResponse('Invalid submission or GET request!')

def save_dinosaur_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player_name = data.get('player_name')
        score = data.get('score')

        DinosaurScore.objects.create(player_name=player_name, score=score)

        return JsonResponse({'message': 'Score saved successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def save_flappy_score(request):
    if request.method == 'POST':
        data = request.json()
        player_name = data.get('player_name', '')
        score = data.get('score', 0)

        FlappyScore.objects.create(player_name=player_name, score=score)

        return JsonResponse({'message': 'Score submitted successfully'})

    return JsonResponse({'error': 'Invalid request method'})
