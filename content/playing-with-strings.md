Title: Playing with strings
Date: 2011-08-26 21:11
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: playing-with-strings

This program deals with reversing a string word wise.For eg. "hello
welcome to india" should return "india to welcome hello".

    import java.util.Arrays;
    import java.util.HashMap;

    public class StringLibrary {
        
        private String reverseStringWordWise(String input) {
            char arr[] = input.toCharArray();
            int len = arr.length;
            int space[] = new int[len];
            int i = 0;
            int pos = 0;
            //Finding position of spaces
            for (i = 0; i & lt; len; i++) {
                if (arr[i] == ' ') {
                    space[pos] = i;
                    pos++;
                    System.out.println(i);
                    
                }
                } if (pos == 0) {
                return input;
            }
            String output = new String(input.substring(space[pos - 1] + 1));
            int spaceIndex = 0;
            while (spaceIndex & lt; pos - 1) {
                
                output = output.concat(" " + input.substring(space[pos - spaceIndex - 2] + 1, space[pos - 1 - spaceIndex]));
                spaceIndex++;
            }
            
            output = output.concat(" " + input.substring(0, space[0]));
            return output;
            
        }
        
        public static void main(String[]args) {
            StringLibrary st = new StringLibrary();
            String test = "This is just a test string";
            System.out.println(st.reverseStringWordWise(test));
            System.out.println(st.reverseStringWordWise("hello world"));
            System.out.println(st.reverseStringWordWise("There has been some effort to make this progarm work"));
            
        }
        
    }

It works for the test cases i tried. Would like to figure out if it
breaks in any case.
