
        console.log('working')
        const panelOption = document.querySelector('.panelOption');
    

    
        const objectOptions = document.querySelector('.objectOptions');
        const triggerOptions = document.querySelector('.triggerOptions');
    
        let contents = document.querySelectorAll('.content');
    
        const onClick = (e) => {
            e.preventDefault();
    
            contents.forEach((content) => {
                if (content.classList.contains("hidden")) {
    
    content.classList.remove('hidden');
    } else {
    content.classList.add('hidden');
    }
            })
        }
    
    
        objectOptions.addEventListener('click', onClick);
        triggerOptions.addEventListener('click', onClick);