import winsound
def play(x):
    x = list(x)
    m = [x[(y-1)*7:y*7] for y in range(1,101)]
    p = [n.index(min(n))+1 for n in m]
    for i in p:
        if i%8==1:
            winsound.Beep(262,500)
        elif i%8==2:
            winsound.Beep(294,500)
        elif i%8==3:
            winsound.Beep(330,500)
        elif i%8==4:
            winsound.Beep(349,500)
        elif i%8==5:
            winsound.Beep(392,500)
        elif i%8==6:
            winsound.Beep(440,500)
        elif i%8==7:
            winsound.Beep(494,500)
        else:
            winsound.Beep(523,500)