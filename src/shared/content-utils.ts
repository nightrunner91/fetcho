export async function waitForElement(selector: string, timeout: number): Promise<Element | null> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeout);
  });
}

export function fillInput(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.focus();
}

export function findButton(pattern: RegExp): HTMLElement | null {
  const buttons = Array.from(
    document.querySelectorAll("button, a[role='button'], .btn, input[type='submit']")
  );
  for (const btn of buttons) {
    const el = btn as HTMLElement;
    const text = el.textContent || (el as HTMLInputElement).value || "";
    if (pattern.test(text)) {
      return el;
    }
  }
  return null;
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
