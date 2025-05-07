from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn
import torch.nn.functional as F
import pandas as pd
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from fastapi.middleware.cors import CORSMiddleware

nltk.download('punkt')
nltk.download('wordnet')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request structure
class TranslationRequest(BaseModel):
    text: str
    use_pretrained: bool

# ========== Helper Functions ==========
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def build_vocab(sentences):
    word_map = {"<pad>": 0, "<unk>": 1}
    index = 2
    for sentence in sentences.dropna():
        tokens = word_tokenize(sentence)
        for word in tokens:
            if word not in word_map:
                word_map[word] = index
                index += 1
    return word_map

def tokenize(sentence, word_map):
    tokens = word_tokenize(clean_text(sentence))
    return torch.tensor([word_map.get(token, word_map["<unk>"]) for token in tokens], dtype=torch.long)


@app.on_event("startup")
def load_models():
    global mbart_model, mbart_tokenizer, transformer, word_map_en, word_map_te, reverse_word_map_te, device

    # MBart
    pretrained_model_name = "aryaumesh/english-to-telugu"
    mbart_model = MBartForConditionalGeneration.from_pretrained(pretrained_model_name)
    mbart_tokenizer = MBart50TokenizerFast.from_pretrained(pretrained_model_name)
 


# ========== Translation Endpoint ==========
from nltk.tokenize import sent_tokenize

@app.post("/translate/")
async def get_translation(request: TranslationRequest):
    text = request.text.strip()
    
    # Step 1: Split input into lines to preserve line breaks
    lines = text.split('\n')

    translated_lines = []

    for line in lines:
        line = line.strip()
        if not line:
            translated_lines.append("")  # Preserve empty lines
            continue

        # Step 2: Split line into sentences
        sentences = sent_tokenize(line)
        translated_sentences = []

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence.endswith(('.', '?', '!', ':', ';')):
                sentence += '.'

            inputs = mbart_tokenizer(sentence, return_tensors="pt")
            translated = mbart_model.generate(**inputs)
            translated_text = mbart_tokenizer.decode(translated[0], skip_special_tokens=True)

            translated_sentences.append(translated_text)

        # Step 3: Reconstruct translated line
        translated_line = " ".join(translated_sentences)
        translated_lines.append(translated_line)

    # Step 4: Rejoin translated lines with newline characters
    full_translation = "\n".join(translated_lines)

    return {
        "original_text": request.text,
        "translated_text": full_translation
    }













    