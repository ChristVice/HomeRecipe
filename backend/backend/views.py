from django.http import HttpResponse

def health_check(request):
    # Add any custom logic here if needed
    return HttpResponse("OK")

