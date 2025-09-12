import { Node, mergeAttributes } from '@tiptap/core'

export const CountdownTimer = Node.create({
  name: 'countdownTimer',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      targetDate: {
        default: '',
      },
      title: {
        default: 'Countdown Timer',
      },
      showDays: {
        default: true,
      },
      showHours: {
        default: true,
      },
      showMinutes: {
        default: true,
      },
      showSeconds: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.countdown-timer',
        getAttrs: element => ({
          targetDate: element.getAttribute('data-target-date') || '',
          title: element.getAttribute('data-title') || 'Countdown Timer',
          showDays: element.getAttribute('data-show-days') === 'true',
          showHours: element.getAttribute('data-show-hours') === 'true',
          showMinutes: element.getAttribute('data-show-minutes') === 'true',
          showSeconds: element.getAttribute('data-show-seconds') === 'true',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { targetDate, title, showDays, showHours, showMinutes, showSeconds } = HTMLAttributes

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'countdown-timer',
        'data-target-date': targetDate,
        'data-title': title,
        'data-show-days': showDays,
        'data-show-hours': showHours,
        'data-show-minutes': showMinutes,
        'data-show-seconds': showSeconds,
      }),
      [
        'div',
        { class: 'timer-title' },
        title
      ],
      [
        'div',
        { class: 'timer-display' },
        showDays && [
          'div',
          { class: 'timer-unit' },
          [
            'span',
            { class: 'timer-value', 'data-timer': 'days' },
            '00'
          ],
          [
            'span',
            { class: 'timer-label' },
            'Gün'
          ]
        ],
        showHours && [
          'div',
          { class: 'timer-unit' },
          [
            'span',
            { class: 'timer-value', 'data-timer': 'hours' },
            '00'
          ],
          [
            'span',
            { class: 'timer-label' },
            'Saat'
          ]
        ],
        showMinutes && [
          'div',
          { class: 'timer-unit' },
          [
            'span',
            { class: 'timer-value', 'data-timer': 'minutes' },
            '00'
          ],
          [
            'span',
            { class: 'timer-label' },
            'Dakika'
          ]
        ],
        showSeconds && [
          'div',
          { class: 'timer-unit' },
          [
            'span',
            { class: 'timer-value', 'data-timer': 'seconds' },
            '00'
          ],
          [
            'span',
            { class: 'timer-label' },
            'Saniye'
          ]
        ]
      ]
    ]
  },

  addNodeView() {
    return ({ HTMLAttributes, updateAttributes }) => {
      const dom = document.createElement('div');
      const { targetDate, title, showDays, showHours, showMinutes, showSeconds } = HTMLAttributes;

      // Timer HTML'ini oluştur
      dom.className = 'countdown-timer';
      dom.setAttribute('data-target-date', targetDate);
      dom.setAttribute('data-title', title);
      dom.setAttribute('data-show-days', showDays);
      dom.setAttribute('data-show-hours', showHours);
      dom.setAttribute('data-show-minutes', showMinutes);
      dom.setAttribute('data-show-seconds', showSeconds);

      dom.innerHTML = `
        <div class="timer-title">${title}</div>
        <div class="timer-display">
          ${showDays ? `
            <div class="timer-unit">
              <span class="timer-value" data-timer="days">00</span>
              <span class="timer-label">Gün</span>
            </div>
          ` : ''}
          ${showHours ? `
            <div class="timer-unit">
              <span class="timer-value" data-timer="hours">00</span>
              <span class="timer-label">Saat</span>
            </div>
          ` : ''}
          ${showMinutes ? `
            <div class="timer-unit">
              <span class="timer-value" data-timer="minutes">00</span>
              <span class="timer-label">Dakika</span>
            </div>
          ` : ''}
          ${showSeconds ? `
            <div class="timer-unit">
              <span class="timer-value" data-timer="seconds">00</span>
              <span class="timer-label">Saniye</span>
            </div>
          ` : ''}
        </div>
      `;

      // Timer fonksiyonelliği
      if (targetDate) {
        const updateTimer = () => {
          const now = new Date().getTime();
          const target = new Date(targetDate).getTime();
          const difference = target - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (showDays) {
              const daysElement = dom.querySelector('[data-timer="days"]');
              if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            }
            if (showHours) {
              const hoursElement = dom.querySelector('[data-timer="hours"]');
              if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            }
            if (showMinutes) {
              const minutesElement = dom.querySelector('[data-timer="minutes"]');
              if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            }
            if (showSeconds) {
              const secondsElement = dom.querySelector('[data-timer="seconds"]');
              if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            }
          } else {
            // Süre doldu
            dom.innerHTML = `
              <div class="timer-title">${title}</div>
              <div class="timer-display">
                <div class="timer-unit">
                  <span class="timer-value">Süre Doldu!</span>
                </div>
              </div>
            `;
            clearInterval(timerInterval);
          }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        // Cleanup
        dom.addEventListener('DOMNodeRemoved', () => {
          clearInterval(timerInterval);
        });
      }

      return {
        dom,
        update: (updatedAttributes) => {
          // Timer güncellendiğinde yeniden başlat
          if (updatedAttributes.targetDate !== targetDate) {
            // Timer'ı yeniden başlat
            location.reload(); // Basit çözüm için sayfayı yenile
          }
        },
        destroy: () => {
          // Cleanup
        },
      };
    };
  },

  addCommands() {
    return {
      setCountdownTimer: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-t': () => this.editor.commands.setCountdownTimer({ 
        targetDate: '', 
        title: 'Countdown Timer',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true
      }),
    }
  },
}) 