Copy code
<template>
    <div>
        <!-- Modal structure -->
        <div v-if="showModal" class="modal-content" @click.self="showModal = false">

            <button class="modal-close" @click="showModal = false">&times;</button>

            <div class="modal-content">
                <h2>please enter username and password</h2>
                <form @submit.prevent="handleSubmit"
                    style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
                    <label for="username">Username:</label>
                    <input style="border-radius: 10px;" type="text" id="username" name="username" v-model="username"
                        required>

                    <label for="password">Password:</label>
                    <input style="border-radius: 10px;" type="password" id="password" name="password" v-model="password"
                        required>

                    <!-- Submit button -->
                    <button type="submit"
                        style="margin-top: 15px; border-radius: 10px; border: none; background-color: teal; color: aliceblue; font-size: 20px; margin-bottom: 10px;">Submit</button>
                        <span style="color: gray;">hint:(admin,admin) is authentic</span>

                    </form>
            </div>
        </div>
        <div v-else>
            <div v-if="errorModal">
                <span>we encounter some error in data fetching</span>
            </div>
            <div v-else>
                <div>
                    <span style="font-size: 20px; font-weight: 600;">
                        title of movie: <span style="font-weight: 800;">{{ jsonApi?.title }}</span>
                    </span>
                    <p style="font-size: 18px; font-weight: 400;">
                        description: <span style="font-size: 14px;">{{ jsonApi?.description }}</span>
                    </p>
                    <p style="font-size: 18px; font-weight: 400;">
                        release year: <span style="font-size: 14px;">{{ jsonApi?.releaseYear }}</span>
                    </p>
                    <p style="font-size: 18px; font-weight: 400;">
                        qualities:
                        <span style="font-size: 14px;" v-for="item in jsonApi?.qualities" :key="item.quality">
                            {{ item.quality }}-
                        </span>
                    </p>
                </div>
                <div class="video-player">
                    <video ref="video" :src="videoSource" @timeupdate="updateCurrentTime" @loadedmetadata="setDuration"
                        style="border-radius: 10px;"></video>
                    <div class="controls">
                        <button @click="togglePlayPause"
                            style="border-radius: 50%; border: 0px; background-color: rgb(227, 57, 57);">
                            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                                fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
                                <path
                                    d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                                class="bi bi-play-fill" viewBox="0 0 16 16">
                                <path
                                    d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                            </svg>
                        </button>

                        <button @click="rewind" style="border-radius: 50%; border: 0px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class="bi bi-rewind-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z" />
                                <path
                                    d="M.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z" />
                            </svg>
                        </button>
                        <button @click="forward" style="border-radius: 50%; border: 0px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class="bi bi-fast-forward-fill" viewBox="0 0 16 16">
                                <path
                                    d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                                <path
                                    d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                            </svg>
                        </button>
                        <span style="margin-top: 10px;">{{ formattedTime }}</span>
                        <select v-model="selectedQuality" @change="changeQuality" style="border-radius: 10px;">
                            <option v-for="quality in qualities" :key="quality.value" :value="quality.value">
                                {{ quality.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { login, getMockMovieDataAuthentic } from '../../api/mockApi';

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const selectedQuality = ref(null);
const video = ref(null);
const jsonApi = ref(null);
const videoSources = ref({});
const showModal = ref(true);
const errorModal = ref(false);
const username = ref('');
const password = ref('');
const qualities = ref([])



const handleSubmit = () => {
    fetchMovieData();
    showModal.value = false
};

// Fetch mock movie data and set initial quality
const fetchMovieData = async () => {
    try {
        const response = await login(username.value, password.value);
        // console.log("Authentication Successful. Token:", response.token);
        if (response.token) {
            jsonApi.value = await getMockMovieDataAuthentic(response.token);
            if (jsonApi.value?.qualities.length) {
                selectedQuality.value = jsonApi.value.qualities[0].quality;
                jsonApi.value.qualities.forEach((item) => {
                    videoSources.value[item.quality] = item.url;
                });
            }
            for (const item of jsonApi.value?.qualities){
                let tempObj = {}
                tempObj.label = item.quality
                tempObj.value = item.quality
                qualities.value.push(tempObj)
            }
        }

    } catch (error) {
        errorModal.value = true
        console.error("Error during authentication or data fetching:", error.message);
    }
};



// Computed property for video source based on selected quality
const videoSource = computed(() => videoSources.value[selectedQuality.value]);

// Watch jsonApi and selectedQuality to load video initially
watch(
    () => selectedQuality.value,
    (newQuality) => {
        if (newQuality) {
            changeQuality(); // Load video for the selected quality
        }
    },
    { immediate: true }
);

// Computed property for formatted time display
const formattedTime = computed(() => {
    const format = (value) => value.toString().padStart(2, '0');
    const minutes = format(Math.floor(currentTime.value / 60));
    const seconds = format(Math.floor(currentTime.value % 60));
    const durationMinutes = format(Math.floor(duration.value / 60));
    const durationSeconds = format(Math.floor(duration.value % 60));
    return `${minutes}:${seconds} / ${durationMinutes}:${durationSeconds}`;
});

// Video control methods
const togglePlayPause = () => {
    if (video.value.paused) {
        video.value.play();
        isPlaying.value = true;
    } else {
        video.value.pause();
        isPlaying.value = false;
    }
};

const forward = () => {
    video.value.currentTime += 3;
};

const rewind = () => {
    video.value.currentTime -= 3;
};

const updateCurrentTime = () => {
    currentTime.value = video.value.currentTime;
};

const setDuration = () => {
    duration.value = video.value.duration;
};

const changeQuality = () => {
    const currentTimePosition = video.value.currentTime;
    video.value.pause();
    video.value.src = videoSource.value;
    video.value.load();
    video.value.currentTime = currentTimePosition;
    if (isPlaying.value) video.value.play();
};


// onMounted(() => {
//     fetchMovieData();
// });
</script>

<style scoped>
.video-player {
    max-width: 600px;
    margin: 20px auto;
    text-align: center;
}

video {
    width: 100%;
    height: auto;
}

.controls {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}

button,
select {
    padding: 5px 10px;
    font-size: 1rem;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    min-width: 90%;
    max-width: 500px;
    /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); */
    /* position: relative; */
}

.modal-close {
    /* position: absolute;
    top: 10px;
    right: 10px; */
    border: none;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: red;
}
</style>