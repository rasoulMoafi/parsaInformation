<template>
    <div>
        <h1>Resizable Component</h1>
        <p>Window width: {{ windowWidth }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            windowWidth: window.innerWidth
        };
    },
    mounted() {
        window.addEventListener("resize", this.handleResize);
    },
    beforeUnmount() { 
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        handleResize() {
            this.windowWidth = window.innerWidth;
        }
    }
};
</script>