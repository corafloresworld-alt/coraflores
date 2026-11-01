(() => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const needs = form.querySelector(".contact-form__needs");
  const needOptions = Array.from(form.querySelectorAll('input[name="besoin"]'));
  const needsError = form.querySelector("#contact-needs-error");
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector("[data-contact-status]");
  const defaultButtonText = submitButton.innerHTML;
  let isSubmitting = false;

  const clearStatus = () => {
    status.hidden = true;
    status.textContent = "";
    status.className = "contact-form__status";
  };

  needOptions.forEach((option) => {
    option.addEventListener("change", () => {
      if (needOptions.some((checkbox) => checkbox.checked)) {
        needsError.hidden = true;
        needs.removeAttribute("aria-invalid");
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!needOptions.some((checkbox) => checkbox.checked)) {
      needsError.hidden = false;
      needs.setAttribute("aria-invalid", "true");
      needOptions[0].focus();
      return;
    }

    needsError.hidden = true;
    needs.removeAttribute("aria-invalid");
    clearStatus();
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Envoi en cours…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Formspree a refusé la demande.");
      }

      form.reset();
      status.classList.add("is-success");
      status.textContent = "Merci, votre message a bien été envoyé.";
      status.hidden = false;
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "Votre message n’a pas pu être envoyé. Il n’a pas été transmis ; veuillez réessayer dans quelques instants.";
      status.hidden = false;
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = defaultButtonText;
    }
  });
})();

