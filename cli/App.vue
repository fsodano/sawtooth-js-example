<template>
    <div class="container">

        <div class="container">
            <h1>Blockchain XO</h1>

            <div class="container">
                <p>Game state: {{game.state}}</p>
                <div class="columns col-3">
                    <div class="cell">{{game.tiles[0]}}</div>
                    <div class="cell">{{game.tiles[1]}}</div>
                    <div class="cell">{{game.tiles[2]}}</div>
                </div>
                <div class="columns col-3">
                    <div class="cell">{{game.tiles[3]}}</div>
                    <div class="cell">{{game.tiles[4]}}</div>
                    <div class="cell">{{game.tiles[5]}}</div>
                </div>
                <div class="columns col-3">
                    <div class="cell">{{game.tiles[6]}}</div>
                    <div class="cell">{{game.tiles[7]}}</div>
                    <div class="cell">{{game.tiles[8]}}</div>
                </div>
            </div>
            <div class="columns col-6">
                <input type="text" placeholder="Cell where you want to place your move [1-9]" v-model="cell"/>
                <input type="button" value="play" v-on:click="play">
            </div>

            <div class="columns col-6">
                <input type="text" placeholder="Name of your game" v-model="gameName"/>
                <input type="button" value="Get Game" v-on:click="getGame">
                <input type="button" value="Create Game" v-on:click="createGame">
                <input type="button" value="Delete Game" v-on:click="deleteGame">
            </div>
        </div>

        <div class="container">
            <h1>Blockchain Hello</h1>

            <input type="text" placeholder="Enter your name" v-model="helloName"/>
            <input type="button" value="Say Hello!" v-on:click="sayHello"/>
        </div>
    </div>

</template>

<script>
  import 'spectre.css';
  import xo from './xo/xo.js';
  import hello from './hello/hello.js';

  export default {
    data () {
      return {
        game: {
          name: '',
          tiles: Array(9).fill('-'),
          state: ''
        },
        cell: 1,
        gameName: '',
        player1: xo.createPlayer(),
        player2: xo.createPlayer(),
        helloName: '',
        lastPlayer: 2
      };
    },
    methods: {
      async getGame () {
        console.log('getting game with name ' + this.gameName);
        this.game = await xo.getGame(this.gameName);
      },
      createGame () {
        console.log('creating game with name ' + this.gameName);
        xo.createGame(this.player1, this.gameName);
      },
      deleteGame () {
        console.log('deleting game with name ' + this.gameName);
        xo.deleteGame(this.player1, this.gameName);
      },
      play () {
        console.log('playing on ' + this.cell);
        xo.play(this.lastPlayer === 2 ? this.player1 : this.player2, this.gameName, this.cell);

        if (this.lastPlayer === 2) {
          this.lastPlayer = 1;
        } else {
          this.lastPlayer = 2;
        }
      },
      sayHello () {
        console.log('greeting ' + this.helloName);
        hello.sayHello(this.helloName);
      }
    }
  };
</script>