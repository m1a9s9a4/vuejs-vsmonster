import Vue from 'vue';

new Vue({
  el: '#app',
  data: {
  	defaultHp: 100,
  	you: {
    	name: 'player',
    	hp: 100,
      maxAttack: 10,
    },
    monster: {
    	name: 'monster',
    	hp: 100,
      maxAttack: 15,
  	},
    logs: [],
    isPlayersTurn: true,
    resetedYou: false,
    resetedMonster: false,
  },
  computed: {
  	youHpRange: function() {
    	return this.checkHealth(this.you.hp);
    },
    monsterHpRange: function() {
    	return this.checkHealth(this.monster.hp);
    }
  },
  watch: {
  	isPlayersTurn: {
    	handler: function() {
      	const em = this;
        if (!em.isPlayersTurn) {
          em.attackPlayer();
        }
      },
      deep: true,
    },
    you: {
    	handler: function() {
      	const em = this;
        if (em.resetedYou) {
        	em.resetedYou = false;
        	return;
        }
        if (em.you.hp <= 0) {
        	alert('Monsterに負けました');
          em.reset();
          return;
        }
				setTimeout(function() {
        	em.isPlayersTurn = !em.isPlayersTurn;
        }, 1000);
      },
      deep: true,
    },
    monster: {
    	handler: function() {
      	const em = this;
        if (em.resetedMonster) {
        	em.resetedMonster = false;
        	return;
        }
        if (em.monster.hp <= 0) {
        	alert('Monsterに勝ちました');
          em.reset();
        	return;
      	}
				setTimeout(function() {
        	em.isPlayersTurn = !em.isPlayersTurn;
        }, 1000);
      },
      deep: true,
    },
  },
  methods: {
  	continueGame() {
    	return !this.reseted && !this.isPlayersTurn;
    },
  	checkHealth(hp) {
    	if (hp <= 50 && hp > 20) {
      	return 'orange';
      }
      
    	return hp <= 20 ? 'red' : 'green';
    },
  	attackPlayer() {
      this.attack(this.monster, this.you);
    },
  	attackMonster(type = 'normal') {
    	if (type == 'special') {
      	this.specialAttack(this.you, this.monster);
        return;
      }
    	this.attack(this.you, this.monster);
    },
  	attack(player, opponent) {
    	console.log('attacking...');
      const attackpoint = this.attackpoint(1, player.maxAttack);
      opponent.hp -= attackpoint;
      this.pushToLogs(player.name, opponent.name + "に" + attackpoint + "ダメージを与えました");
    },
    specialAttack(player, opponent) {
      const attackpoint = this.attackpoint(player.maxAttack, player.maxAttack);
      opponent.hp -= attackpoint;
      this.pushToLogs(player.name, opponent.name + "に" + attackpoint + "大ダメージを与えました");
    },
    healYou() {
    	this.heal(this.you);
    },
    heal(player) {
    	if (player.hp > 90) {
      	this.pushToLogs(player.name, '体力が90以上のため回復はできません');
      	return;
      }
      player.hp += 10;
    },
    attackpoint(min, max) {
    	return Math.floor(Math.random() * max + min);
    },
    reset() {
    	this.you.hp = this.defaultHp;
      this.monster.hp = this.defaultHp;
      this.logs = [];
      this.isPlayersTurn = true;
      this.resetedYou = true;
      this.resetedMonster = true;
      console.log('reseted.....');
    },
    pushToLogs(name, text) {
    	this.logs.push({
      	name: name + '-turn',
        text: text,
      });
    },
    giveUp() {
    	if (confirm('あきらめますか？')) {
      	alert('負けました');
      	this.reset();
        return;
      }
    }
  }
});

