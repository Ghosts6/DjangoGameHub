from django.contrib.auth.hashers import make_password
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .form import UserForm, GameScoreForm
from .models import GameScore, Guest
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User
import json
import os
import openai

def register(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists.')
                return redirect('home')
            if len(password) < 6:
                messages.error(request, 'Password must be at least 6 characters long.')
                return redirect('home')
            user = form.save(commit=False)
            user.password = make_password(password)
            user.save()
            login(request, user)
            messages.success(request, f'Welcome, {username}!')
            return redirect('home')
        else:
            for field in form.errors:
                for error in form.errors[field]:
                    messages.error(request, f'{field}: {error}')
            return redirect('home')
    else:
        form = UserForm()
    return render(request, 'home.html', {'register_form': form, 'login_form': AuthenticationForm()})

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')
                return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'home.html', {'login_form': form, 'register_form': UserForm()})

def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    elif request.session.get('guest_id'):
        del request.session['guest_id']
    return redirect('home')

def home(request):
    if request.method == 'POST':
        game_name = request.POST.get('selected_game')
        if not request.user.is_authenticated and not request.session.get('guest_id'):
            if not request.session.session_key:
                request.session.create()
            guest_name = f'Guest-{os.urandom(4).hex()}'
            guest = Guest.objects.create(guest_name=guest_name, session_key=request.session.session_key)
            request.session['guest_id'] = guest.id
        
        if game_name == 'snake':
            return redirect('Snake_Game')
        elif game_name == 'tic_tac':
            return redirect('Tic_Tac_Toe')
        elif game_name == 'flappy_bird':
            return redirect('Flappy_Bird')
        elif game_name == 'dinosaur':
            return redirect('Dinosaur_Game')
        elif game_name == 'akinator':
            return redirect('akinator')

    login_form = AuthenticationForm()
    register_form = UserForm()
    return render(request, 'home.html', {'login_form': login_form, 'register_form': register_form})

def Snake_Game(request):
    if not request.user.is_authenticated and not request.session.get('guest_id'):
        return redirect('home')
    top_score = GameScore.objects.filter(game='snake').order_by('-score').first()
    return render(request, 'snake.html', {'top_score': top_score})

def Flappy_Bird(request):
    if not request.user.is_authenticated and not request.session.get('guest_id'):
        return redirect('home')
    top_score = GameScore.objects.filter(game='flappy_bird').order_by('-score').first()
    return render(request, 'flappy_bird.html', {'top_score': top_score})

def Tic_Tac_Toe(request):
    if not request.user.is_authenticated and not request.session.get('guest_id'):
        return redirect('home')
    return render(request, 'tic_tac_toe.html')

def Dinosaur_Game(request):
    if not request.user.is_authenticated and not request.session.get('guest_id'):
        return redirect('home')
    top_score = GameScore.objects.filter(game='dinosaur').order_by('-score').first()
    return render(request, 'dinosaur_game.html', {'top_score': top_score})

openai.api_key = os.getenv("OPENAI_API_KEY")

def akinator(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        conversation_history = data.get('history', [])
        user_answer = data.get('answer')
        
        if not openai.api_key:
            return JsonResponse({'error': 'OpenAI API key not configured.'}, status=500)
        
        # Add the user's answer to the history (convert to natural language)
        if user_answer != 'start_game':
            # Map button answers to natural language for better AI understanding
            answer_mapping = {
                'yes': 'Yes',
                'no': 'No',
                'dont_know': "I don't know / I'm not sure",
                'probably': 'Probably yes / Most likely',
                'probably_not': 'Probably not / Unlikely',
                'guess_incorrect': 'No, that guess is wrong. Continue asking questions.'
            }
            
            natural_answer = answer_mapping.get(user_answer, user_answer)
            conversation_history.append({"role": "user", "content": natural_answer})
        
        # Enhanced system message for Akinator with category-based approach
        system_message = {
            "role": "system",
            "content": """You are Akinator, a genius at guessing characters through strategic questioning.

UNDERSTANDING USER ANSWERS:
The user can respond with:
- "Yes" = Definitely true
- "No" = Definitely false
- "Probably yes / Most likely" = Likely true, but not 100% certain
- "Probably not / Unlikely" = Likely false, but not 100% certain
- "I don't know / I'm not sure" = User is uncertain - treat as partially helpful information

When user says "probably" or "don't know", give them partial credit but ask follow-up questions to clarify.
Adjust your confidence based on answer certainty. A "probably" answer means less certainty than "yes".

CRITICAL RULES - FOLLOW STRICTLY:
1. EVERY question MUST be answerable with yes/no/probably/don't know
2. NEVER ask "which one" or "either/or" questions (e.g., "Book or movie?" ❌)
3. NEVER ask open-ended questions requiring specific answers
4. ALWAYS phrase as "Is your character..." or "Does your character..." format
5. NEVER ask "Is it [specific name]?" until you've narrowed down to a VERY small category (3-5 possibilities max)
6. ALWAYS use hierarchical category narrowing - go from broad to specific
7. Ask about CATEGORIES and TRAITS, not individual names
8. Only make a final guess when you're 90% confident based on unique traits
9. If user gives uncertain answers ("probably", "don't know"), ask MORE questions before guessing

QUESTIONING STRATEGY (Follow this order):
Phase 1 – Broad Classification (Questions 1–3)
1. Is this person/character real?
   - If yes → proceed with real-world questions.
   - If no → proceed with fictional questions.

2. Is it a human being?
   - If no → ask: "Is it an animal?"
   - If no again → ask: "Is it an object or another type of entity?"

3. Is it from the modern era?
   - If no → ask: "Is it from a historical period?"
   - If no again → ask: "Is it from ancient times?"


Phase 2 – Medium / Field (Questions 4–7)
If fictional:
4. Is the character from a book?
   - If no → ask sequentially:
     "From a movie?" → "From a TV show?" → "From a video game?" → "From an anime?" → "From a comic?" → "From mythology?"

If real:
5. Is the person an artist or performer?
   - If no → ask:
     "A scientist?" → "A politician?" → "An athlete?" → "A historical figure?"

6. Is the person male?
   - If no → ask: "Is the person female?"
   - (Optional follow-up) "Is the person an adult?"

7. Is this person/character primarily associated with a specific country or culture?
   - If yes → ask: "Is it from [continent/culture options]?"


Phase 3 – Narrow Classification (Questions 8–12)
8. Is the character part of a specific franchise or series?
   - If yes → ask which one.

9. Is it from a specific sub-genre or era (e.g., fantasy, sci-fi, Renaissance, 1980s)?

10. Is the character a protagonist (main hero)?
    - If no → ask:
      "A villain?" → "A sidekick?" → "A mentor or supporting role?"

11. Does this person/character have notable abilities or powers?
    - If yes → ask for type (magic, technology, physical skill, intellect, etc.)

12. Is appearance an important identifying trait?
    - If yes → ask: "Do they have a distinctive color, clothing, or physical feature?"


Phase 4 – Ultra-Specific Traits (Questions 13+)
(All answers must be: Yes / No / Probably / Probably Not / Don’t Know)

13. Do they use a unique weapon, tool, or item?
14. Are they known for a specific quote or catchphrase?
15. Do they have a famous relationship (friend, rival, family, or partner)?
16. Are they associated with a specific location or setting?
17. Is there a major event or story moment that defines them?
18. Do they have powers, skills, or traits that few others share?
19. Are they recognized for a distinctive outfit, symbol, or logo?
20. Are they connected to a well-known organization, team, or group?
21. Are they commonly seen as a hero or a positive figure?
22. Are they considered a villain or antagonist?
23. Are they widely recognized in popular culture?
24. Do they have any animal companions or sidekicks?
25. Do they have an origin or backstory that is central to who they are?
26. Is their appearance drastically different from normal humans?
27. Do they primarily appear in action scenes or conflicts?
28. Are they known for humor or comedic moments?
29. Do they possess leadership qualities or command others?
30. Do they have a tragic or emotional storyline?

(All questions accept the following responses only:
YES / NO / PROBABLY / PROBABLY NOT / DON’T KNOW)

EXAMPLES OF GOOD VS BAD QUESTIONS:

BAD (Too specific, too early):
❌ Q3: "Is it Mario?"
❌ Q5: "Is it Pikachu?"
❌ Q4: "Is it Spider-Man?"

GOOD (Category-based):
✅ Q1: "Is your character from a video game?"
✅ Q5: "Is your character from a Nintendo franchise?"
✅ Q8: "Is your character the main protagonist of their series?"
✅ Q11: "Does your character have special powers or abilities?"
✅ Q15: "Does your character wear red and have a mustache?"

CATEGORY EXAMPLES BY MEDIA:
Video Games: "Nintendo games?", "RPG games?", "Fighting games?", "PlayStation exclusives?"
Movies: "Marvel movies?", "Disney animations?", "Action films?", "Star Wars universe?"
TV Shows: "Animated series?", "Comedy shows?", "Fantasy series?", "Superhero shows?"
Books: "Fantasy novels?", "Classic literature?", "Young adult fiction?"

HANDLING UNCERTAIN ANSWERS:
- If user says "probably" or "don't know" repeatedly, ask different types of questions
- Use more specific yes/no questions that are easier to answer
- Ask about visual traits or memorable characteristics
- Example: Instead of "Is your character powerful?" ask "Can your character fly?"

MAKING A GUESS:
Only guess when you can answer YES to ALL:
- Have I asked at least 12-15 questions? (More if many uncertain answers)
- Have I narrowed down the franchise/series?
- Have I identified unique traits that fit only 1-3 characters?
- Am I 90%+ confident?
- Did the user give mostly certain ("yes"/"no") answers to key questions?

Format your guess as: "Is it [Character Name]?"
Format questions as clear yes/no questions ending with "?"

If the user says your guess is wrong ('guess_incorrect' or 'No, that guess is wrong'):
- Acknowledge: "I see, let me ask more questions."
- Ask about traits that distinguish similar characters
- NEVER guess the same character twice
- Continue narrowing down the category
- Ask what makes their character different from your guess

Keep questions concise (under 15 words when possible) and easy to answer with yes/no.
Adapt your questioning based on answer certainty - more uncertain answers = more questions needed."""
        }
        
        messages = [system_message] + conversation_history
        
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=150,
                temperature=0.7,
            )
            
            akinator_response = response.choices[0].message.content.strip()
            
            # Check if it's a success message
            if any(phrase in akinator_response.lower() for phrase in ["great job!", "i knew it!", "well done!", "congratulations!"]):
                return JsonResponse({
                    'question': akinator_response,
                    'success': True  # This flag indicates we should trigger the celebration
                })
            # Check if it's a guess
            elif akinator_response.startswith("Is it ") and "?" in akinator_response:
                guess = akinator_response.replace("Is it ", "").replace("?", "").strip()
                return JsonResponse({'guess': guess})
            else:
                return JsonResponse({'question': akinator_response})
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return JsonResponse({
                'error': 'Failed to get response from Akinator. Please try again.'
            }, status=500)
    
    return render(request, 'akinator.html')

def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')
        score = data.get('score')
        if request.user.is_authenticated:
            GameScore.objects.create(user=request.user, game=game, score=score)
            return JsonResponse({'message': 'Score saved successfully'})
        elif request.session.get('guest_id'):
            guest = Guest.objects.get(id=request.session.get('guest_id'))
            GameScore.objects.create(guest=guest, game=game, score=score)
            return JsonResponse({'message': 'Score saved for guest successfully'})
        else:
            return JsonResponse({'message': 'Invalid request'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)

def top_scores(request):
    snake_top_scores = GameScore.objects.filter(game='snake').order_by('-score')[:5]
    flappy_top_scores = GameScore.objects.filter(game='flappy_bird').order_by('-score')[:5]
    dinosaur_top_scores = GameScore.objects.filter(game='dinosaur').order_by('-score')[:5]

    return render(request, 'top_scores.html', {
        'snake_top_scores': snake_top_scores,
        'flappy_top_scores': flappy_top_scores,
        'dinosaur_top_scores': dinosaur_top_scores,
    })

def custom_404(request, exception):
    return render(request, '404.html', status=404)

def custom_500(request):
    return render(request, '500.html', status=500)