document.addEventListener('DOMContentLoaded', function() {
  // Animation and counter code remains the same as before...
 const animatedElements = document.querySelectorAll('.animate__animated');
  
  animatedElements.forEach(element => {
    new Waypoint({
      element: element,
      handler: function(direction) {
        element.classList.add(element.classList[1]);
        this.destroy(); // Only animate once
      },
      offset: '90%'
    });
  });
  
  // Simple counter animation
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Start counter when visible
  new Waypoint({
    element: document.querySelector('.waitlist-count'),
    handler: function() {
      animateValue('waitlist-counter', 0, 1200, 2000);
    },
    offset: '90%'
  });
  // Form submission handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Joining...
      `;

      try {
        // Create a hidden iframe for Formspree submission
        const iframe = document.createElement('iframe');
        iframe.name = 'formspree-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Change form target to the iframe
        const originalTarget = form.target;
        form.target = 'formspree-iframe';
        
        // Submit the form normally (will submit to the iframe)
        form.submit();
        
        // Success - we handle it on our page
        const successMsg = document.getElementById('form-success');
        successMsg.style.display = 'block';
        successMsg.classList.add('animate__animated', 'animate__fadeIn');
        
        // Reset form
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger mt-3';
        errorMsg.textContent = 'Oops! Something went wrong. Please try again.';
        form.parentNode.insertBefore(errorMsg, form.nextSibling);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
          errorMsg.remove();
        }, 5000);
        
        console.error('Form submission error:', error);
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.innerHTML = 'Join Waitlist😎';
      }
    });
  }
});





 