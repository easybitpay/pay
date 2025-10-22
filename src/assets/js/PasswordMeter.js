const defaultOptions = {
  minLength: 8,
  checkUppercase: true,
  checkLowercase: true,
  checkDigit: true,
  cheeckChar: true,
  scoreHightlightClass: "active",
};

const defaultQueries = {
  instanceQuery: "[data-password-meter]",
  visibilityQuery: '[data-password-meter-control="visibility"]',
  highlightQuery: '[data-password-meter-control="highlight"]',
};

export class PasswordMeterComponent {
  instance;
  inputElement;
  visibilityElement;
  highlightElement;
  options;
  queries;
  score;
  checkSteps;

  constructor(settings) {
    // Combination Of User Settings With Default Settings
    this.options = Object.assign(defaultOptions, settings.options || null);
    this.queries = Object.assign(defaultQueries, settings.queries || null);

    // Define Elements
    this.instance = document.body.querySelector(this.queries.instanceQuery);
    this.inputElement = this.instance.querySelector("input");
    this.visibilityElement = this.instance.querySelector(
      this.queries.visibilityQuery
    );
    this.highlightElement = this.instance.querySelector(
      this.queries.highlightQuery
    );

    // Define Score Info
    this.score = 0;
    this.checkSteps = 5;

    // Event Handlers
    this.#handlers();
  }

  #handlers() {
    if (this.inputElement) {
      this.inputElement.addEventListener("input", () => {
        this.check();
      });
    }

    if (this.visibilityElement) {
      this.visibilityElement.addEventListener("click", () => {
        this.#visitbility();
      });
    }
  }

  #visitbility() {
    if (this.visibilityElement && this.inputElement) {
      const visibleIcon =
        this.visibilityElement.querySelector("i:not(.d-none)");

      const hiddenIcon = this.visibilityElement.querySelector("i.d-none");

      const typeAttr = this.inputElement.getAttribute("type") || "";

      if (typeAttr === "password") {
        this.inputElement.setAttribute("type", "text");
      } else {
        this.inputElement.setAttribute("type", "password");
      }

      visibleIcon?.classList.add("d-none");
      hiddenIcon?.classList.remove("d-none");

      this.inputElement.focus();
    }
  }

  #checkLength() {
    if (this.inputElement)
      return this.inputElement.value.length >= this.options.minLength; // 20 score

    return false;
  }

  #checkLowerCase() {
    const val = this.inputElement ? this.inputElement.value : "";
    return /[a-z]/.test(val); // 20 score
  }

  #checkUpperCase() {
    const val = this.inputElement ? this.inputElement.value : "";
    return /[A-Z]/.test(val); // 20 score
  }

  #checkDigit() {
    const val = this.inputElement ? this.inputElement.value : "";
    return /[0-9]/.test(val); // 20 score
  }

  #checkChar() {
    const val = this.inputElement ? this.inputElement.value : "";
    return /[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val); // 20 score
  }

  #getCheckScore() {
    let count = 1;

    if (this.options.checkUppercase) {
      count++;
    }

    if (this.options.checkLowercase) {
      count++;
    }

    if (this.options.checkDigit) {
      count++;
    }

    if (this.options.checkChar) {
      count++;
    }

    this.checkSteps = count;
    return 100 / this.checkSteps;
  }

  #highlight() {
    const items = this.highlightElement
      ? [].slice.call(this.highlightElement.querySelectorAll("div"))
      : [];
    const total = items.length;
    let index = 0;
    const checkScore = this.#getCheckScore();
    const score = this.getScore();

    items.map((item) => {
      index++;
      if (checkScore * index * (this.checkSteps / total) <= score) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  getScore() {
    return this.score;
  }

  check() {
    let score = 0;
    const checkScore = this.#getCheckScore();

    if (this.#checkLength()) {
      score = score + checkScore;
    }

    if (this.options.checkUppercase && this.#checkUpperCase()) {
      score = score + checkScore;
    }

    if (this.options.checkLowercase && this.#checkLowerCase()) {
      score = score + checkScore;
    }

    if (this.options.checkDigit && this.#checkDigit()) {
      score = score + checkScore;
    }

    if (this.options.checkChar && this.#checkChar()) {
      score = score + checkScore;
    }

    this.score = score;
    this.#highlight();
  }
}
