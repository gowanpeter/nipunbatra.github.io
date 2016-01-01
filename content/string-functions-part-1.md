Title: String functions Part 1
Date: 2011-08-21 15:31
Author: nipunbatra
Category: Blog
Tags: algorithms
Slug: string-functions-part-1

An interesting question.How to check whether a string has all unique
characters. I came up with 2 solutions to this. Maybe they can be
further optimized for space and time.Would like to hear from other about
the same.  
Here is the first solution which is O(nlgn)

    public boolean isAllUniqueChar1(String inp)
        {
            //O(nlogn) sorting +O(n) checking for duplicates
            String sortedString=sortString(inp);
            int length=sortedString.length();
            if(length==1)
            {
                return true;
                
            }
            for(int i=0;i<length-1;i++)
            {
                if(sortedString.charAt(i)==sortedString.charAt(i+1))
                {
                    System.out.println(sortedString.charAt(i)+" is repeated");
                    return false;
                }
            }
            return true;
            
            
        }
        private String sortString(String inp) {
            char [] c = inp.toCharArray();
            Arrays.sort(c);
            return new String(c);

        }

A better approach is to use a 2\^8 i.e 256 length boolean array which
tells whether a particular ascii value had been encountered before. This
solution is O(n)

    private boolean isAllUniqueChar2(String inp) {
            //O(n) time and constant space
            int length=inp.length();
            if(length==1)
            {
                return true;
            }
            boolean[] isCharSet=new boolean[256];
            int asciiValue;
            for(int i=0;i<length;i++)
            {
                asciiValue=inp.charAt(i);
                if(isCharSet[asciiValue])
                {
                    return false;
                }
                else
                {
                    isCharSet[asciiValue]=true;
                }
            }
            
            return true;
            
        }

A third more fancier solution on the same lines using a Hashmap

    private boolean isAllUniqueChar3(String test) {
            //Hashmap has only 2 values for each key
            //Null if char was not encountered before or true if it were encountered before
            if(test.length()==1)
            {
                return true;
            }
            HashMap charSet=new HashMap();
            char[] testChar=test.toCharArray();
            for(char c:testChar)
            {
                if(charSet.get(Character.valueOf(c))!=null)
                {
                    return false;
                }
                else
                {
                     charSet.put(Character.valueOf(c),Boolean.valueOf(true));
                }
            }
            return true;
        }
        
