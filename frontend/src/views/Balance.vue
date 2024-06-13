<template>
    <div class="root">
        <h1 class="title">Kontostand</h1>
    </div>
    <NavigationBar />
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
export default {
    name: 'BalanceScreen',
    components: {
        NavigationBar
    }
};
</script>
<style scoped>
.root{
    padding: 2rem;
}
.title{
    color: var(--color5);
    text-align: center;
    font-size: 2em;
}
</style>