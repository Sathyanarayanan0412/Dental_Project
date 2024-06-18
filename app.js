document.addEventListener('DOMContentLoaded', function () {
    const loginBox = document.getElementById('loginBox');
    const recordingPage = document.getElementById('recordingPage');
    const audioRecordingsPage = document.getElementById('audioRecordingsPage');
    const doctorNameInput = document.getElementById('doctorName');
    const patientNameInput = document.getElementById('patientName');
    const displayDoctorName = document.getElementById('displayDoctorName');
    const displayPatientName = document.getElementById('displayPatientName');

    // Variables to store current recording state
    let recorder; // MediaRecorder instance
    let chunks = []; // Array to store recorded chunks
    let startTime; // Timestamp of when recording started
    let isRecording = false;
    let isPaused = false;
        // Event listener for login button
        document.getElementById('loginButton').addEventListener('click', function () {
            const doctorName = doctorNameInput.value.trim();
            const patientName = patientNameInput.value.trim();
            
            if (doctorName === '' || patientName === '') {
                alert('Please fill in all fields.');
                return;
            }
    
            displayDoctorName.textContent = doctorName;
            displayPatientName.textContent = patientName;
    
            // Hide login box and show recording page
            loginBox.classList.remove('active');
            recordingPage.classList.add('active');
        });
    
        // Event listener for home button
        document.getElementById('homeButton').addEventListener('click', function () {
            // Clear input fields and reset displayed names
            doctorNameInput.value = '';
            patientNameInput.value = '';
            displayDoctorName.textContent = '';
            displayPatientName.textContent = '';
    
            // Hide recording page and show login box
            recordingPage.classList.remove('active');
            loginBox.classList.add('active');
        });
    
        // Event listener for recording control buttons
        const recordingBox = document.getElementById('recordingBox');
        const controlButtons = recordingBox.querySelector('.control-buttons');
        const startButton = controlButtons.querySelector('.start');
        const pauseButton = controlButtons.querySelector('.pause');
        const stopButton = controlButtons.querySelector('.stop');
        const recordingText = recordingBox.querySelector('.recording-text');
        const timerDisplay = recordingBox.querySelector('#timer');
    
        startButton.addEventListener('click', startRecording);
        pauseButton.addEventListener('click', pauseRecording);
        stopButton.addEventListener('click', stopRecording);
    
        function startRecording() {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function (stream) {
                    recorder = new MediaRecorder(stream);
                    chunks = [];
    
                    recorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    };
    
                    recorder.onstop = function () {
                        const blob = new Blob(chunks, { type: 'audio/webm' });
                        chunks = [];
    
                        // Create a new audio recording item
                        const recordingItem = document.createElement('li');
                        recordingItem.classList.add('audio-recording-item');
                        recordingItem.setAttribute('data-index', 'Recording ' + (audioRecordingsList.children.length + 1));
    
                        // Create audio element to playback recording
                        const audioElement = document.createElement('audio');
                        audioElement.controls = true;
                        audioElement.src = URL.createObjectURL(blob);
    
                        // Create delete button for the recording
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete-button');
                        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                        deleteButton.addEventListener('click', function () {
                            recordingItem.remove();
                        });
    
                        // Append audio element and delete button to the recording item
                        recordingItem.appendChild(audioElement);
                        recordingItem.appendChild(deleteButton);
    
                        // Append recording item to the list
                        audioRecordingsList.appendChild(recordingItem);
    
                        // Update UI after recording
                        recordingText.textContent = 'Recording saved!';
                        startButton.style.display = 'inline-block';
                        pauseButton.style.display = 'none';
                        stopButton.style.display = 'none';
                        timerDisplay.textContent = '00:00:00';
                        isRecording = false;
                        isPaused = false;
                    };
    
                    recorder.start();
                    startTime = Date.now();
                    updateTimer();
                    isRecording = true;
    
                    // Update UI during recording
                    recordingText.textContent = 'Recording...';
                    startButton.style.display = 'none';
                    pauseButton.style.display = 'inline-block';
                    stopButton.style.display = 'inline-block';
                })
                .catch(function (err) {
                    console.error('Error accessing microphone:', err);
                    alert('Error accessing microphone. Please check your browser permissions.');
                });
        }
    
        function pauseRecording() {
            if (recorder && recorder.state === 'recording') {
                recorder.pause();
                recordingText.textContent = 'Recording paused';
                pauseButton.textContent = 'Resume';
                isPaused = true;
            } else if (recorder && recorder.state === 'paused') {
                recorder.resume();
                recordingText.textContent = 'Recording...';
                pauseButton.textContent = 'Pause';
                isPaused = false;
            }
        }
    
        function stopRecording() {
            if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
                recorder.stop();
                clearInterval(timerInterval);
            }
        }
    
        // Timer function
        let timerInterval;
    
        function updateTimer() {
            timerInterval = setInterval(function () {
                const elapsedTime = Date.now() - startTime;
                const formattedTime = formatTime(elapsedTime);
                timerDisplay.textContent = formattedTime;
            }, 1000);
        }
    
        function formatTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    
        // Event listener for audio recordings button
        const audioRecordingsButton = document.getElementById('audioRecordingsButton');
        audioRecordingsButton.addEventListener('click', function () {
            recordingPage.classList.remove('active');
            audioRecordingsPage.classList.add('active');
        });
    
        // Event listener for back button
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', function () {
            audioRecordingsPage.classList.remove('active');
            recordingPage.classList.add('active');
        });
    
        // Event listener for fill form button
        const fillFormButton = document.getElementById('fillFormButton');
        fillFormButton.addEventListener('click', function () {
            alert('Fill form functionality will be implemented here.');
        });
    });
    
