<template>
  <div style="margin: 80px 0px 0px 80px;" v-if="task1 == true || task2 == true || task3 == true || task5 == true">
    <svg @click="backToMenu()" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-x-circle"
      style="color: red;" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
    </svg>
  </div>
  <div class="flex-container">

    <div v-if="task1 == false && task2 == false && task3 == false && task5 == false" style="display: flex; align-items: center;justify-content: center; margin-top: 150px;">
      <button @click="task1 = true">First Task</button>
      <button @click="task2 = true">Second Task</button>
      <button @click="task3 = true">third Task</button>
      <button @click="task5 = true">fifth Task</button>
    </div>
    <div v-if="task1" class="mainDiv">
      <videoPlayerComp />
    </div>
    <div v-if="task2" class="mainDiv">
      <videoPlayerWithApi />
    </div>
    <div v-if="task3" class="mainDiv">
      <videoPlayerWithAuthentications />
    </div>
    <div v-if="task5" class="mainDiv">
      <optimizeCatchingApi />
    </div>
  </div>

</template>

<script setup>
import videoPlayerComp from './components/videoPlayerComp/index.vue'
import videoPlayerWithApi from './components/videoPlayerWithApi/index.vue'
import videoPlayerWithAuthentications from './components/videoPlayerWithAuthentications/index.vue'
import optimizeCatchingApi from './components/optimizeCatchingApi/index.vue'
import { ref } from 'vue'

const task1 = ref(false)
const task2 = ref(false)
const task3 = ref(false)
const task5 = ref(false)

function backToMenu(){
  task1.value = false
  task2.value = false
  task3.value = false
}
</script>

<style scoped>
.flex-container {
  padding-top: 100px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
}

.mainDiv {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  background-color: blueviolet;
  width: 180px;
  height: 50px;
  border: 0px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 800;
  color: white;
  margin: 0px 20px;
}
</style>
