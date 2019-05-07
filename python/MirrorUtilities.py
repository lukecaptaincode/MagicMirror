import string
import random

'''
Holds all single use or not specific functions for the mirror
'''


class MirrorUtilities:
    '''
     Adapted from:
        https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits?rq=1
    Generates a string id for the mirror as a unique identifier accepts option params for size and type of digit to use
    :param size -  the size of the string to generate
    :param chars - the chars to build the string from, defaults to uppercase alphabetical and numeric
    :return the id - retruns the random generated id
    '''
    @staticmethod
    def mirror_id_generator(size=12, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))  # choice a random char from chars to length of size
