# workout-analysis-webapp
This app takes training data and represents it in bubble charts, so you can quickly see what movements are overtrained/neglected.
Can filter on different stages of workout: warmup,strength,skills,wod.
Primitives allow you to view movements in their simplest form, ie overhead squat and front squat would be simplified to squat, running/rowing/bike would be simplified to cardio, etc.

To run locally, node.js is required. once installed, run start.bat and follow instructions for url(usually localhost:8080/Crossfit-Dashboard).




# Docker 
To run the project inside docker container: 
docker build -f DockerFile -t workout-analysis-image . && docker run -p 127.0.0.1:8080:8080 --name workout-analysis-container workout-analysis-image 