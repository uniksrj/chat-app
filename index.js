const { hash } = window.location;

        function encodeMessage(message) {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            return btoa(String.fromCharCode(...data));
        }

        function decodeMessage(encodedMessage) {            
            const data = atob(encodedMessage);          
            const decoder = new TextDecoder();
            return decoder.decode(Uint8Array.from(data, c => c.charCodeAt(0)));
        }
        addEventListener("DOMContentLoaded", (event) => {
        let message = hash.replace('#', '');
        if (message) {
            message = decodeMessage(message);

            document.querySelector('#message-linkk').classList.add('hide');
            document.querySelector('#message-show').classList.remove('hide');
            document.querySelector('p').textContent = message;
        }

        document.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();

            document.querySelector('#message-linkk').classList.add('hide');
            document.querySelector('#link-list').classList.remove('hide');

            let message = document.querySelector('#message-input').value;
            const encryptedMessage = encodeMessage(message);

            let inputLink = document.querySelector('#link-input');
            inputLink.value = `${window.location.origin}${window.location.pathname}#${encryptedMessage}`;
            inputLink.select();
        });

        const button = document.querySelector('#emoji-button');
        const picker = document.querySelector('#emoji-picker');

        button.addEventListener('click', (e) => {
            e.preventDefault();
            picker.classList.toggle('hide');
        });

        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && !button.contains(e.target)) {
                picker.classList.add('hide');
            }
        });

        picker.addEventListener('emoji-click', event => {
            event.preventDefault();
            const input = document.querySelector('#message-input');
            input.value += event.detail.unicode;
        });

        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support the Web Speech API. Please use Google Chrome.');
        } else {
            const recognition =   new webkitSpeechRecognition() || new SpeechRecognition();            
            console.log(recognition);
            
        
            // Set recognition parameters
            recognition.continuous = true; // Keep listening until stopped
            recognition.interimResults = true; // Show interim results
            recognition.lang = window.navigator.language; // Language
        
            // Elements
            const startBtn = document.getElementById('start-btn');
            const transcriptDiv = document.getElementById('message-input');
        
            // Variable to store the final transcript
            let finalTranscript = '';
            let recognizing = false;

            document.getElementById('start-btn').addEventListener('click', (e) => {
                e.preventDefault();
                console.log(transcriptDiv.value);
                
                if (recognizing) {
                    recognition.stop();
                    recognizing = false;
                    startBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
                } else {
                    finalTranscript = '';
                    recognition.start();
                    recognizing = true;
                    startBtn.innerHTML = '<i class="fa-solid fa-microphone-lines-slash"></i>';
                }
            });

            recognition.addEventListener("result", (event)=>{     
                    console.log('Received speech recognition result.');
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                            console.log('Final transcript:', event.results[i][0].transcript);
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                            console.log('Interim transcript:', event.results[i][0].transcript);
                        }
                    }
                    transcriptDiv.value = finalTranscript + interimTranscript;
            })

        
            // Event handler for errors
            recognition.addEventListener("error", (event) => {
                alert("Microphone is not on, please on your mic")
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
                    recognizing = false;
                    startBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
                }
            });
        
            // Add end event listener
            recognition.addEventListener("end", () => {
                console.log('Speech recognition service disconnected');
                recognizing = false;
                startBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
            });
        
            
        }

    });