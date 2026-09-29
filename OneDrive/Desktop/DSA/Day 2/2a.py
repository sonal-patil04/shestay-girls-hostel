# sum of digits of a given number

num=int(input("Enter a number : "))
sum=0

while(num>0):
    sum+=num%10
    num=num//10
print("Sum of digits is ",sum)