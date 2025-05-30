<script>
  import { onMount } from 'svelte';

  export let eventName = '';

  let element;
  let fired = false;

  onMount(() => {
    const handleVisibility = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          posthog.capture(eventName)
          fired = true;
        }
      });
    };

    const observer = new IntersectionObserver(handleVisibility, {
      threshold: 0.1, // Adjust threshold as needed
    });

    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  });
</script>

<div bind:this={element}>
  <slot></slot>
</div>
