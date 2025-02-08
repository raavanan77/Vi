from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.views import TokenRefreshView

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response = Response({
                'user': UserSerializer(user).data,
                'message': 'Registration successful'
            })
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=3600
            )
            response.set_cookie(
                'refresh_token',
                str(refresh),
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=86400  # 24 hours
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.set_cookie(
                'access_token',
                response.data['access'],
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=3600
            )
            response.set_cookie(
                'refresh_token',
                response.data['refresh'],
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=86400
            )
            # Remove tokens from response body
            response.data = {'message': 'Login successful'}
        return response

@api_view(['POST'])
def logout(request):
    print("Loggedout")
    response = Response({"message": "Logged out successfully"})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

class UserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        print(request.user)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class RefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            raise InvalidToken('No refresh token found in cookies')
            
        request.data['refresh'] = refresh_token
        
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            response.set_cookie(
                'access_token',
                response.data['access'],
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=3600
            )
            response.data = {'message': 'Token refreshed successfully'}
            
        return response