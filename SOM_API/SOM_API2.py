# Importing the dataset..
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from minisom import MiniSom
from PIL import Image
import PIL.ImageOps
from base64 import decodestring
import base64
import io
import json


# Gets the Base64 string, and converts it to the correct format to be processed..
def Decode_Base64(Base64):
    placeHolders = ['!','@','*']
    decodingTable = {
        '!' : '+',
        '@' : '/',
        '*' : '='
        }
    
    Base64 = list(Base64)

    # Iterates through each element and replaces the palceholder symbols with the real symbols..
    for Symbol in range(len(Base64)):
        if Base64[Symbol] in placeHolders:
            # Replaces the placeHolder characters with the actual symbols for Base64..
            Base64[Symbol] = decodingTable[Base64[Symbol]]
            
    # Merges the array of characters to form the true Base64 string..
    trueBase64 = ''.join(Base64)

    return trueBase64


# Converts Base64 image to 1D numpy array..
def Base64_Decimal (coded):
    # Recieves the Base64 image, which already assumes is 18x18. and converts it to a numpy 18x18
    # Array..
    buffer = io.BytesIO()
    # Decoding the Base64 recieved to an image...
    imgdata = base64.b64decode(coded)
    # Opening the image object..
    img = Image.open(io.BytesIO(imgdata))
    # Inverted the image...
    imageObject = PIL.ImageOps.invert(img.convert('RGB'))
    # Resizing the image to the appropriate the size to fit the dataset..
    new_img = imageObject.resize((28, 28))
    # Converting the image to an array..
    ARRAY = np.array(new_img)
    # Reducing the dimentionality of the image by removing the RGB aspects and making it grayscale
    processedImage = ARRAY[:,:,0]

    # Flattens the procecced array from 2D to 1D..
    processedImage = processedImage.flatten()

    return processedImage

    
# Returns the most frequent element in an array of labels..
def most_frequent(List):
    Counter = 0
    Label = List[0]
      
    for element in List:
        Current_Frequency = List.count(element)
        if(Current_Frequency > Counter):
            Counter = Current_Frequency
            Label = element
  
    return Label

# Takes in the Base64 from the Application, and returns the predicted letter of the picture sent..
def SOM (Data):
    Dictionary = {
        0:'A',
        1:'B',
        2:'C',
        3:'D',
        4:'E',
        5:'F',
        6:'G',
        7:'H',
        8:'I',
        9:'J',
        10:'K',
        11:'L',
        12:'M',
        13:'N',
        14:'O',
        15:'P',
        16:'Q',
        17:'R',
        18:'S',
        19:'T',
        20:'U',
        21:'V',
        22:'W',
        23:'X',
        24:'Y',
        25:'Z'
    }
    

    # Importing the dataset..
    Dataset = pd.read_csv("A-Z_Handwritten_Data_Compressed.csv")
    X = Dataset.iloc[:,1:].values
    Y = Dataset.iloc[:,0].values

    sc = MinMaxScaler(feature_range = (0,1))
    X = sc.fit_transform(X)

    # Training the SOM
    # X , Y : Dimentions
    # Input : The number of features in our dataset, AKA len of X exluding Y..
    # Sgima: The radius between the nodes..
    # Learning_Rates: How much the weights are updated by each iteration
    # Decay_function: none

    print("Loading..")
    # Creating the SOM instance..
    SOM = MiniSom(x=5,y=5, input_len= 784, sigma = 0.4, learning_rate=0.5)

    # initializing Random weights..
    SOM.random_weights_init(X)

    # Training the SOM..
    SOM.train_random(data = X,num_iteration = 10)

    # Returns the SOM MAP
    SOM_Map = SOM.labels_map(X,Y)

    # This is the neuron with the majority of samples mapped to that neuron with our sample..
    # Converts the Base64 string recieved to the correct format..

    FixedInput = Decode_Base64(Data)
    Input = Base64_Decimal(FixedInput)
    win_neuron = SOM.winner(Input)

    Labels = []

    
    print("Loading..")
    # This will check if the neuron is in the SOM Map..
    if win_neuron in SOM_Map:
        Neuron = (SOM_Map[win_neuron].most_common())
        for Value in Neuron:
            Labels.append(Value[0])

    # Outputs the predicted image label..
    Key = most_frequent(Labels)

    # Converts the number to a letter..
    return Dictionary[Key]


    
rawInput = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAASABIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzltGJF3JblpIrV1Vp2TjZ03E9v161j3+nmG1kZZAybztYc7gAD/IivTfGF3a2XhuOwto0UzsjXbR8AqDxGOORyCRntXBT31pcLNpdrAqRIp8ly2Dnad5OfXI/KufC1HVjztWV9PQxqTlFq2pymDRW4NJsNo3ag+7HOIjjNFdXMi+dHTeIyWhAYkhZGxnt8tcx4TVZdfgWRQ6lWyGGQfkNFFYUP4cfRGM/4U/mYzM248nr60UUV0nSf//Z"
decodedInput = "@9j@4AAQSkZJRgABAQAAAQABAAD@2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL@2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL@wAARCAASABIDASIAAhEBAxEB@8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL@8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4!Tl5ufo6erx8vP09fb3!Pn6@8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL@8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3!Pn6@9oADAMBAAIRAxEAPwDzltGJF3JblpIrV1Vp2TjZ03E9v161j3!nmG1kZZAybztYc7gAD@IivTfGF3a2XhuOwto0UzsjXbR8AqDxGOORyCRntXBT31pcLNpdrAqRIp8ly2Dnad5OfXI@KufC1HVjztWV9PQxqTlFq2pymDRW4NJsNo3ag!7HOIjjNFdXMi!dHTeIyWhAYkhZGxnt8tcx4TVZdfgWRQ6lWyGGQfkNFFYUP4cfRGM@4U@mYzM248nr60UUV0nSf@@Z"

print(SOM(decodedInput))



    
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/som', methods=['POST'])
def doSOM():
    try:
        data = Decode_Base64(request.form['base64'])
        data = SOM(data)
        return data, 201
    except:
        return "We could not handle your request, please try again!", 200
    '''
    try: 
        data = request.form['base64']
        print(data)
    except:
        return "Invalid input!", 200
    try:
        output = SOM(data)
        print(output)
        return output,201
    except:
        print(SOM(data))
        return "We could not handle your request!", 200
    '''

if __name__ == '__main__':
    app.run(debug=False)
