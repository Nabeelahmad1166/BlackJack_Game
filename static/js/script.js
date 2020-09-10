// Challenge for BlackJack Game

let blackjack_Game = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0, 'wins': 0, 'losses': 0, 'draws': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'isStand': false,
    'allowStand': false,
    'turnOver': false,
}

all_indices = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'];
all_scores = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 1];

const YOU = blackjack_Game['you'];
const DEALER = blackjack_Game['dealer'];
const Hit_sound = new Audio('static/sounds/swish.m4a');
const Bust_sound = new Audio('static/sounds/aww.mp3');
const Win_sound = new Audio('static/sounds/cash.mp3');

document.querySelector('#Hit-button').addEventListener('click', Hit_func);
document.querySelector('#Deal-button').addEventListener('click', Deal_func);
document.querySelector('#Stand-button').addEventListener('click', Dealer_Logic);

function Hit_func() {
    if (blackjack_Game['isStand'] == false) {
        let rand_index = random_card();
        let card_ind = all_indices[rand_index];
        console.log("Card name : " + card_ind)

        YOU['score'] = calculate_score(YOU, rand_index);
        console.log("your score is " + YOU['score'])

        show_card(YOU, card_ind);
        update_score(YOU);
        blackjack_Game['allowStand'] = true;
    }
}

function random_card() {
    let rand_index = Math.floor((Math.random()) * 13);
    console.log("Random index : " + rand_index);
    return rand_index;
}

function calculate_score(curr_player, rand_ind) {
    // if adding 11 keeps me bellow 21, then keep Ace = 11, otherwise set Ace = 1
    let score_calculated = 0;
    if ((rand_ind == 12) && (((curr_player['score']) + all_scores[rand_ind]) > 22)) {
        score_calculated = all_scores[rand_ind + 1]
    } else {
        score_calculated = all_scores[rand_ind]
    }

    return (curr_player['score'] + score_calculated);
}

function update_score(curr_player) {
    if (curr_player['score'] > 21) {
        document.querySelector(curr_player['scoreSpan']).textContent = "BUST!";
        document.querySelector(curr_player['scoreSpan']).style.color = 'red';
        if (curr_player == YOU) {
            Bust_sound.play();
        }

    } else {
        document.querySelector(curr_player['scoreSpan']).textContent = curr_player['score'];
    }
}

function show_card(curr_player, card_ind) {
    if (curr_player['score'] <= 21) {
        curr_card = document.createElement('img');
        curr_card.src = `static/images/${card_ind}.png`;
        document.querySelector(curr_player['div']).appendChild(curr_card);
        Hit_sound.play();
    }

}

function Deal_func() {
    if (blackjack_Game['turnOver'] == true) {
        blackjack_Game['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).style.color = '#ffffff';
        document.querySelector(DEALER['scoreSpan']).style.color = '#ffffff';
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        document.querySelector('#blackjack-result').textContent = "Let's play again";
        document.querySelector('#blackjack-result').style.color = 'black';
        blackjack_Game['turnOver'] = false;
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Dealer_Logic() {
    if (blackjack_Game['allowStand'] == true) {

        blackjack_Game['isStand'] = true;

        while ((DEALER['score'] < 16) && (blackjack_Game['isStand'] == true)) {
            let rand_card = random_card();
            let card_ind = all_indices[rand_card];
            DEALER['score'] = calculate_score(DEALER, rand_card);
            console.log("dealer score is " + DEALER['score'])
            show_card(DEALER, card_ind);
            update_score(DEALER);
            await sleep(1000);
        }

        blackjack_Game['turnOver'] = true;
        blackjack_Game['allowStand'] = false;
        showResult(compute_winner());
    }
}

function compute_winner() {
    let winner;
    console.log('Your score was : ', YOU['score'])
    console.log('Dealer score was : ', DEALER['score'])
    if (YOU['score'] <= 21) {
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            console.log("You Won!")
            winner = YOU;
            YOU['wins']++;
        } else if (YOU['score'] < DEALER['score']) {
            console.log("You Lost!")
            winner = DEALER;
            YOU['losses']++;
        } else if (YOU['score'] == DEALER['score']) {
            console.log("You Drew!")
            YOU['draws']++;
        }
    } else if ((YOU['score'] > 21) && (DEALER['score'] <= 21)) {
        console.log('You Lostttttttttttttttttttttttttttt!');
        YOU['losses']++;
        winner = DEALER;
    } else if ((YOU['score'] > 21) && (DEALER['score'] > 21)) {
        console.log('You Drew!');
        YOU['draws']++;
    }
    console.log("winner is : ", winner)
    return winner;
}


function showResult(winner) {
    let msg, msg_color;

    if (winner == YOU) {
        msg = 'You Won!';
        msg_color = 'green';
        Win_sound.play();
    } else if (winner == DEALER) {
        msg = 'You Lost!';
        msg_color = 'red';
        Bust_sound.play();
    } else {
        msg = 'You Drew!';
        msg_color = 'black';
    }

    document.querySelector('#blackjack-result').textContent = msg;
    document.querySelector('#blackjack-result').style.color = msg_color;

    document.querySelector('#wins').textContent = YOU['wins'];
    document.querySelector('#losses').textContent = YOU['losses'];
    document.querySelector('#draws').textContent = YOU['draws'];
}