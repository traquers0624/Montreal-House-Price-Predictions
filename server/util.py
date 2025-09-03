import os
import json
import pickle
import numpy as np

__regions = None
__data_columns = None
__model = None

def get_estimated_price(region, bedrooms):
    loc_index = __data_columns.index(region) if region in __data_columns else -1

    x = np.zeros(len(__data_columns))
    x[0] = bedrooms
    if loc_index >= 0:
        x[loc_index] = 1
    
    return round(__model.predict([x])[0],2)

def get_region_names():
    return __regions

def load_saved_artifacts():
    print("loading saved artifacts...")
    global __data_columns
    global __regions
    
    base_path = os.path.dirname(__file__)
    artifacts_path = os.path.join(base_path, "artifacts")
    
    with open(os.path.join(artifacts_path,"columns.json"), 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __regions = [col for col in __data_columns[1:]]
        
    global __model
    with open(os.path.join(artifacts_path, "clean_Montreal_property_listings.pickle"),'rb') as f:
        __model = pickle.load(f)
        
        
if __name__ == '__main__':
    load_saved_artifacts()
