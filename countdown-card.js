class CountdownCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div class="card-banner" style="margin-bottom: 1.5rem;"></div>
                    <div class="card-content" style="text-align: center; line-height: 3rem;"></div>
                </ha-card>
            `;
            this.banner = this.querySelector("div.card-banner");
            this.content = this.querySelector("div.card-content");
        }

        this.updateBanner(this.config.image);

        if (!this.timer) {
            clearInterval(this.timer);
            this.timer = setInterval(this.renderContent, 1000, hass, this);
        }
    }

    setConfig(config) {
        if (!config.entities) {
            throw new Error("You need to define entities");
        }
        this.config = config;
    }

    getCardSize() {
        return this.config.entities.length + 1;
    }

    updateBanner(image) {
        this.banner.innerHTML = `<img src="${image}" style="width: 100%; height: auto;" />`;
    }

    renderContent(hass, self) {
        self.render(
            self.getEntityStates(self, hass),
            self.content
        );
    }

    render(entityStates, content) {
        var contentInner = '<table style="width: 100%">';
        for (var i = 0; i < entityStates.length; i++) {
            var state = entityStates[i];

            contentInner += `
            <tr>
                <td style="white-space: nowrap; text-align: left;">
                    ${state.name}
                </td>
                <td style="text-align: right; color: ${state.color}; width: 99%">
                    ${state.value}
                </td>
            </tr>`;
        }
        contentInner += '</table>';

        content.innerHTML = contentInner;
    }

    calculateRemaining(now, end) {
        var seconds = Math.floor((end - (now))/1000);
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);
        var totalHours = hours;

        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

        return {
            hours: totalHours,
            minutes: minutes,
            seconds: seconds
        };
    }

    getEntityStates(self, hass) {
        var entityStates = [];
        var entities = self.config.entities;
        var indicators = self.config.indicators;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var color = 'auto';

            const entityId = entity.entity;
            const state = hass.states[entityId];
            const stateStr = state ? state.state : 'unavailable';

            var value = '';
            if (stateStr !== 'unavailable') {
                const dateNow = new Date();
                const dateEnd = new Date(stateStr);

                if (dateNow <= dateEnd) {
                    var calculatedRemaining = self.calculateRemaining(dateNow, dateEnd);

                    const hours = calculatedRemaining.hours < 10 ? `0${calculatedRemaining.hours}` : calculatedRemaining.hours;
                    const minutes = calculatedRemaining.minutes < 10 ? `0${calculatedRemaining.minutes}` : calculatedRemaining.minutes;
                    const seconds = calculatedRemaining.seconds < 10 ? `0${calculatedRemaining.seconds}` : calculatedRemaining.seconds;
                    value = `${hours}:${minutes}:${seconds}`;

                    for (var j = 0; j < indicators.length; j++) {
                        var indicator = indicators[j];

                        if (calculatedRemaining.hours < indicator.hours) {
                            color = indicator.color;
                        }
                    }
                } else {
                    value = 'expired';
                }
            } else {
                color = 'rgba(255, 255, 255, 0.6)';
                value = 'unavailable';
            }

            entityStates[i] = {
                name: state.attributes.friendly_name,
                value: value,
                color: color
            };
        }

        return entityStates;
    }

}

customElements.define("countdown-card", CountdownCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "countdown-card",
    name: "Countdown card",
    preview: true,
    description: "Counts down to a date and time",
});
