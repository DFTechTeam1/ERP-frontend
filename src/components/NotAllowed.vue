<template>
  <div>
    <div class="wrapper">
      <section class="pedastal">
        <div class="pedastal-block1"></div>
        <div class="pedastal-block2"></div>
        <div class="trapezium">
          <div></div>
          <div></div>
        </div>
      </section>
      <section class="hall">
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
        <div class="hall-support"></div>
        <div class="hall-pillar"></div>
      </section>
      <section class="lower-support">
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
        <div class="ornaments">
          <div></div>
          <div></div>
        </div>
        <div class="lower-support-pillar"></div>
      </section>
      <section class="lower-roof">
        <div></div>
        <div></div>
      </section>
      <section class="upper-support">
        <div class="container">
          <div class="lower-support-pillar"></div>
          <div class="lower-support-pillar"></div>
          <div class="lower-support-pillar"></div>
          <div class="lower-support-pillar"></div>
          <div class="lower-support-pillar"></div>
          <div class="lower-support-pillar"></div>
        </div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <div class="ornaments"><div></div><div></div></div>
        <section class="sign"></section>
      </section>
      <section class="upper-roof">
        <div></div>
        <svg width="520px" height="90px">
          <path d="M495.689265,72.9065145 L520,90 L0,90 L24.3069308,72.9091893 L45.9698498,74.0444947 C88.9890231,76.2990341 125.690619,43.2527689 127.945158,0.233595624 L127.687016,0.220066965 L128,0 L392,0 L392.30918,0.217392187 L392,0.233595624 C394.254539,43.2527689 430.956135,76.2990341 473.975308,74.0444947 L495.689265,72.9065145 Z" id="Combined-Shape" fill="#FDBB3B"></path>
        </svg>
        <div></div>
      </section>
      <section class="roof-top">
        <div></div>
        <div></div>
      </section>
      <div class="cloud cloud-01"></div>
      <div class="cloud cloud-02"></div>
      <div class="cloud cloud-03"><div></div></div>
      <div class="sun"><div class="copy">403</div></div>
    </div>
    <div class="wall">
        <div class="wall-roofing-bottom"></div>
        <div class="wall-roofing-top"></div>
    </div>
    <div class="headline">
      <h1>Forbidden City</h1>
      <h2>✋ You don't have permission to access 🚧 this area ✋</h2>

      <button @click.prevent="goDashboard" style="margin-top: 15px; background-color: #CA502E; border-radius: 4px; padding: 8px 12px;">Go Back</button>
    </div>
    
    
  </div>
</template>

<style>
.forbid {
  background: #F3E2CB !important;
}
</style>

<style lang="scss" scoped>
$bg-color: #F3E2CB;
$dark-red: #44291E;
$red: #9C4E46;
$wall-red: #A24D4C;
$dark-green: #678B80;
$green: #7BA598;
$yellow: #EEDB44;
$roof-yellow: #FDBB3B;
$roof-yellow-darker: #D0982E;
$blue: #490CED;
$sun: #CA502E;
$beige: #F8DAB2;

@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono');

@mixin align-x {
	left: 50%;
	transform: translateX(-50%);
}
@mixin align-y {
	top: 50%;
	transform: translateY(-50%);
}


html, body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

body {
	background: $bg-color;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
}

.wrapper {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	align-content: center;
	position: absolute;
	bottom: 0;
	overflow: hidden;
	&:hover {
		.sun {
			transform: translateY(-200px);
		}
	}
}

.pedastal {
	width: 1000px;
	height: 90px;
	background: white;
	position: relative;
	
	&-block1 {
		width: 125px;
		height: 30px;
		background: $wall-red;
		box-sizing: border-box;
		&::before {
			content: '';
			@extend .pedastal-block1;
			position: absolute;
			right: 0;
		}
	}
	&-block2 {
		width: 63px;
		height: 30px;
		background: $wall-red;
		box-sizing: border-box;
		&::before {
			content: '';
			@extend .pedastal-block2;
			position: absolute;
			right: 0;
		}
	}
}

.hall {
	width: 520px;
	height: 60px;
	background: $dark-red;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	z-index: 3;
	&-pillar {
		height: 100%;
		width: 16px;
		background: linear-gradient(90deg, #DA5447, $red);
	}
	&-support {
		width: 40px;
		height: 12px;
		position: relative;
		&::before {
			content: '';
			width: 16px;
			height: 12px;
			background: linear-gradient(135deg, $dark-green 50%, transparent 51%) no-repeat;
			background-position: -2px 0;
			position: absolute;
			top: 0;
			left: 0;
		}
		&::after {
			content: '';
			width: 16px;
			height: 12px;
			background: linear-gradient(-135deg, $dark-green 50%, transparent 51%) no-repeat;
			background-position: 2px 0;
			position: absolute;
			top: 0;
			right: 0;
		}
	}
}

.lower-support {
	width: 520px;
	height: 30px;
	background: $green;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	border-left: 4px solid $green;
	border-right: 4px solid $green;
	z-index: 3;
	&-pillar {
		height: 100%;
		width: 16px;
		background: linear-gradient(90deg, #87C9B6, $dark-green);
	}
}

.ornaments {
	width: 40px;
	height: 30px;
	display: flex;
	div {
		width: 20px;
		height: 30px;
		position: relative;
		&:first-child {
			&::before, &::after {
				content: '';
				width: 8px;
				height: 8px;
				border-radius: 4px;
				background: $yellow;
				position: absolute;
			}
			&::before {
				top: 6px;
				left: 11px;
			}
			&::after {
				bottom: 6px;
				left: 11px;
			}
		}
		&:last-child {
			&::before, &::after {
				content: '';
				width: 8px;
				height: 8px;
				border-radius: 4px;
				background: $yellow;
				position: absolute;
			}
			&::before {
				top: 6px;
				right: 11px;
			}
			&::after {
				bottom: 6px;
				right: 11px;
			}
		}
	}
}

.lower-roof {
	width: 376px;
	height: 40px;
	background: $roof-yellow;
	position: relative;
	z-index: 3;
	&::before {
		content: '';
		border-left: 112px solid transparent;
		border-bottom: 40px solid $roof-yellow;
		position: absolute;
		bottom: 0;
		left: -112px;
	}
	&::after {
		content: '';
		border-right: 112px solid transparent;
		border-bottom: 40px solid $roof-yellow;
		position: absolute;
		bottom: 0;
		right: -112px;
	}
	
	div:first-child {
		display: inline-block;
		border-left: 36px solid transparent;
		border-top: 15px solid $roof-yellow-darker;
		position: absolute;
		left: -112px;
		bottom: -15px;
	}
	div:last-child {
		display: inline-block;
		border-right: 36px solid transparent;
		border-top: 15px solid $roof-yellow-darker;
		position: absolute;
		right: -112px;
		bottom: -15px;
	}
}

.upper-support {
	width: 376px;
	height: 20px;
	background: $green;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	z-index: 3;
	.container {
		width: 296px;
		height: 20px;
		display: flex;
		align-self: center;
		flex-direction: row;
		justify-content: space-between;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.ornaments {
		div:first-child, div:last-child {
			&::after {
				display: none;
			}
			&::before {
				width: 6px;
				height: 6px;
			}
		}
		div:first-child {
			&::before {
				top: 7px;
				left: 8px;
			}
		}
		div:last-child {
			&::before {
				top: 7px;
				right: 8px;
			}
		}
	}
}

.upper-roof {
	width: 520px;
	height: 90px;
	position: relative;
	z-index: 3;
	div:first-child {
		display: inline-block;
		border-left: 72px solid transparent;
		border-top: 20px solid $roof-yellow-darker;
		position: absolute;
		left: 0px;
		bottom: -20px;
	}
	div:last-child {
		display: inline-block;
		border-right: 72px solid transparent;
		border-top: 20px solid $roof-yellow-darker;
		position: absolute;
		right: 0px;
		bottom: -20px;
	}
	&-curved {
		width: 100px;
		height: 78px;
		background: $bg-color;
		position: absolute;
		z-index: 1000;
		&:nth-child(2) {
			left: -102px;
			top: -2px;
			transform: rotate(3deg);
			border-radius: 0 0 100px 0 ;
		}
		&:nth-child(3) {
			right: -102px;
			top: -2px;
			transform: rotate(-3deg);
			border-radius: 0 0 0 100px ;
		}
	}
}

%shared-boxes {
	width: 8px;
	height: 8px;
	background: $roof-yellow;
	position: absolute;
}

.roof-top {
	width: 264px;
	position: relative;
	z-index: 3;
	div {
		@extend %shared-boxes;
		top: -8px;
		&:first-child {
			left: 0px;
			&::before, &::after {
				content: '';
				@extend %shared-boxes;
				left: 8px;
			}
			&::after {
				bottom: 8px;
			}
		}
		&:last-child {
			right: 0px;
			&::before, &::after {
				content: '';
				@extend %shared-boxes;
				right: 8px;
			}
			&::after {
				bottom: 8px;
			}
		}
	}
}

.sign {
	width: 12px;
	height: 16px;
	background: $blue;
	border: 4px solid #9C4E46;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.trapezium {
	border-bottom: 90px solid $beige;
	border-right: 50px solid transparent;
	border-left: 50px solid transparent;
	width: 288px;
	position: absolute;
	bottom: 0;
	@include align-x;
	div {
		position: absolute;
		bottom: -90px;
		width: 20px;
		&::before {
			content: '';
			position: absolute;
			width: 20px;
		}
		&:first-child {
			left: 24px;
			border-bottom: 90px solid white;
			border-left: 40px solid transparent;
			&::before {
				border-top: 90px solid white;
				border-right: 40px solid transparent;
			}
		}
		&:last-child {
			right: 24px;
			border-bottom: 90px solid white;
			border-right: 40px solid transparent;
			&::before {
				border-top: 90px solid white;
				border-left: 40px solid transparent;
				right: 0;
			}
		}
	}
}

.wall {
	width: 100%;
	height: 90px;
	background: $wall-red;
	position: fixed;
	bottom: 0;
	z-index: -1;
	display: flex;
	justify-content: center;
	&::before {
		content: '';
		width: 100%;
		max-width: 1240px;
		height: 140px;
		background: $wall-red;
		position: absolute;
		bottom: 0;
		@include align-x;
	}
	&-roofing-bottom {
		width: 100%;
		height: 24px;
		background: $roof-yellow;
	}
	&-roofing-top {
		width: 1240px;
		height: 24px;
		background: $roof-yellow;
		position: absolute;
		top: -50px;
		&::before {
			content: '';
			border-bottom: 24px solid $roof-yellow;
			border-left: 10px solid transparent;
			position: absolute;
			left: -10px;
		}
		&::after {
			content: '';
			border-bottom: 24px solid $roof-yellow;
			border-right: 10px solid transparent;
			position: absolute;
			right: -10px;
		}
	}
}

.sun {
	width: 400px; 
	height: 400px;
	background: $sun;
	border-radius: 200px;
	z-index: 1;
	position: absolute;
	transform: translateY(-100px);
	display: flex;
	justify-content: center;
	align-items: center;
	transition: transform 1s;
}

.cloud {
	background: white;
	position: relative;
	z-index: 2;
	&::before, &::after {
		background: white;
		display: block;
	}
	&-01 {
		width: 88px;
		height: 32px;
		border-radius: 16px;
		transform: translate(-200px, -50px);
		animation: cloud-1 50s ease-in-out infinite alternate;
		&::before {
			content: '';
			width: 50px;
			height: 50px;
			border-radius: 25px;
			display: block;
			transform: translate(22px, -25px);
		}
	}
	&-02 {
		width: 100px;
		height: 40px;
		border-radius: 20px;
		transform: translate(60px, -120px);
		animation: cloud-2 40s ease-in-out infinite alternate;
		&::before {
			content: '';
			width: 46px;
			height: 46px;
			border-radius: 23px;
			transform: translate(38px, -23px);
		}
		&::after {
			content: '';
			width: 30px;
			height: 30px;
			border-radius: 15px;
			transform: translate(16px, -60px);
		}
	}
	&-03 {
		width: 70px;
		height: 24px;
		border-radius: 12px;
		transform: translate(210px, 0px);
		animation: cloud-3 30s ease-in-out infinite alternate;
		&::before {
			content: '';
			width: 14px;
			height: 14px;
			border-radius: 7px;
			transform: translate(46px, -7px);
		}
		&::after {
			content: '';
			width: 16px;
			height: 16px;
			border-radius: 8px;
			top: 0;
			transform: translate(12px, -50px);
		}
		div {
			width: 30px;
			height: 30px;
			background: white;
			border-radius: 15px;
			display: block;
			transform: translate(24px, -30px);
		}
	}
}

.copy {
	font-family: 'Permanent Marker', cursive;
	font-size: 8em;
	color: $bg-color;
	padding-bottom: 60px;
}

.headline {
	text-align: center;
	position: relative;
	padding-top: 40px;
	z-index: 3;
	h1 {
		font-family: 'Permanent Marker', cursive;
		color: #2b2b2b;
		font-size: 8em;
		margin: 0;
	}
	h2 {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.25em;
		color: #2b2b2b;
	}
}

@keyframes cloud-1 {
	0% 	{ transform: translate(-200px, -50px); }
	100% 	{ transform: translate(-280px, -50px); }
}
@keyframes cloud-2 {
	0% 	{ transform: translate(60px, -120px); }
	100% 	{ transform: translate(300px, -120px); }
}
@keyframes cloud-3 {
	0% 	{ transform: translate(210px, 0px); }
	100% 	{ transform: translate(100px, 0px); }
}

@media only screen and (max-width: 1440px) {
	.headline {
		h1 {
			font-size: 4em;
		}
		h2 {
			font-size: 1em;
		}
	}
}
</style>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function goDashboard() {
  router.push('/admin/dashboard')
}
</script>