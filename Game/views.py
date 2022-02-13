from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">多人在线对战游戏</h1>'
    line2 = '<h2 style="text-align: center">正在开发中......</h2>'
    return HttpResponse(line1+line2)
