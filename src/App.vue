<template>
	<div id="app">
		<!-- <img alt="Vue logo" src="./assets/logo.png">
		<HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<router-view></router-view>
	</div>
</template>

<script>


export default {
	name: 'App',
	components: {
		
	}
}
</script>

<style>
/* 加上html, body这段是为了把margin和padding的默认值去掉，
否则会有白边 */
html, body {
	margin:0;
	padding:0;
}
#app {
	/* font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px; */
	height: 100vh;
}
</style>


