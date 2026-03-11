import ollama


def getCorrectSpelling(text):
    prompt = "Correct all the spelling mistakes only(do not add any extra punctuation marks on your own, if there are already punctuation marks then leave it as it is do not remove it, and also just return the sentence with corrected spellings, do not add any other text to the output) in this text: "
    return prompt + '"' + text + '"'


def getCorrectSpellingAndGrammer(text):
    prompt = "Correct all the spelling and grammer mistakes only and just return the corrected sentence only(do not remove parts of sentences, do so only to fix grammer mistakes only and anything inside bracket must pe places as it is, do not add any other sentence to the output liek 'Here is the corrected sentence:') in this text: "
    return prompt + '"' + text + '"'


def getIndexOfSpellingMistaks(sen):
    list = sen.split()


client = ollama.Client()


model = "llama3.2:3b"


def runPrompt(model, prompt):
    response = client.generate(model=model, prompt=prompt)
    print(response.response.strip('"'))


txt = "Would you like me to check a different sentence or a longer passage for errors?"


prompt = getCorrectSpelling(txt)

runPrompt(model, prompt)
print("d")
runPrompt(model, getCorrectSpellingAndGrammer(txt))
