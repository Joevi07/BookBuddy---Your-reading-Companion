document.addEventListener("DOMContentLoaded", function () {
    const speakerBtn = document.getElementById("speaker-btn");
    const searchInput = document.getElementById("search-word");

    const wordText = document.getElementById("word-text");
    const deflist = document.getElementById("def-list");
    const synonymsList = document.getElementById("synonyms-list");

    async function fetchWordData(word)
    {
        try{
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if(!response.ok) throw new Error("Word not found");

            const data = await response.json();
            const entry = data[0];
            const meanings = entry.meanings;
            wordText.textContent = entry.word;

            deflist.innerHTML="";
            meanings.forEach(meaning=>
            {
                meaning.definitions.forEach(def=>
                {
                    const li = document.createElement("li");
                    li.textContent = def.definition;
                    deflist.appendChild(li);
                }
                );
            }
            );

            const firstSyns = meanings[0]?.synonyms || [];
            synonymsList.textContent = firstSyns.length>0?firstSyns.join(","):"No synonyms found";
        }
        catch(error)
        {
            wordText.textContent = "Not Found";
            deflist.innerHTML = '<li>${error.message}</li>';
            synonymsList.textContent="";
        }
    }
    
    async function translateToTamil(word)
    {
        try{
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|ta`);
            const data = await response.json();
            const tamil = data.responseData.translatedText;
            document.getElementById("tamil-meaning").textContent = tamil;
        }
        catch(error)
        {
            console.error("Translation error:",error);
            document.getElementById("tamil-meaning").textContent = "Translation failed";
        }
    }

       

    speakerBtn.addEventListener("click", () => {
        const word = searchInput.value.trim();
        if (word) {
            const utter = new SpeechSynthesisUtterance(word);
            utter.lang = "en-GB";
            speechSynthesis.speak(utter);
        } else {
            console.log("Please enter a word to speak.");
        }
    });
    const search_button = document.getElementById('icon');

    search_button.addEventListener("click",function(e){
        
            const word = searchInput.value.trim();
            if(word){
                fetchWordData(word);
                translateToTamil(word);
            }
            else
             console.log("Please enter a word to search meaning");
       

    });
      
});
