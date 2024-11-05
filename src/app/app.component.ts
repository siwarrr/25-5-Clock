import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Work';

  breakLength: number = 5;
  sessionLength: number = 25;
  sessionTime: string = '25:00';
  isSession: boolean = true;
  isRunning: boolean = false;
  timerInterval: any;
  
  constructor(private renderer: Renderer2) {}

  breakDecrement() {
    if (this.breakLength > 1) {
      this.breakLength -= 1;
    }
  }
  
  breakIncrement() {
    if (this.breakLength < 60) {
      this.breakLength += 1;
    }
  }
  
  sessionDecrement() {
    if (this.sessionLength > 1) {
      this.sessionLength -= 1;
      this.updateSessionTime();
    }
  }
  
  sessionIncrement() {
    if (this.sessionLength < 60) {
      this.sessionLength += 1;
      this.updateSessionTime();
    }
  }

  updateSessionTime() {
    this.sessionTime = this.formatTime(this.sessionLength, 0);
  }

  formatTime(minutes: number, seconds: number): string {
    const min = minutes < 10 ? `0${minutes}` : minutes;
    const sec = seconds < 10 ? `0${seconds}` : seconds;
    return `${min}:${sec}`;
  }

  startStop() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    const [minutes, seconds] = this.sessionTime.split(':').map(Number);
    let totalSeconds = minutes * 60 + seconds;

    this.timerInterval = setInterval(() => {
      totalSeconds--;
      if (totalSeconds < 0) {
        clearInterval(this.timerInterval);
        this.isSession = !this.isSession;
        totalSeconds = (this.isSession ? this.sessionLength : this.breakLength) * 60;
        
        const label = this.isSession ? 'Session' : 'Break';
        document.getElementById('timer-label')!.textContent = label;

        this.playBeep();
      }

      const displayMinutes = Math.floor(totalSeconds / 60);
      const displaySeconds = totalSeconds % 60;
      this.sessionTime = this.formatTime(displayMinutes, displaySeconds);

    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.pauseTimer();
    this.breakLength = 5;
    this.sessionLength = 25;
    this.isSession = true;
    this.isRunning = false;
    this.sessionTime = this.formatTime(this.sessionLength, 0);

    // Reset the timer label and clear audio if playing
    document.getElementById('timer-label')!.textContent = 'Session';
    const audioElement = document.getElementById('beep') as HTMLAudioElement;
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  playBeep() {
    const audioElement = document.getElementById('beep') as HTMLAudioElement;
    audioElement.play();
  }
}
