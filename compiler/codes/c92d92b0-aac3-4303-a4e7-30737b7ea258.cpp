
#include <bits/stdc++.h>
using namespace std;

int getmax(vector<int> &arr) {
    int cur_max = arr[0], cur_min = arr[0];
    int overall_max = arr[0], overall_min = arr[0];
    int total_sum = arr[0];  
    
    for (int i = 1; i < arr.size(); i++) {
        cur_max = max(cur_max + arr[i], arr[i]);
        overall_max = max(overall_max, cur_max);
        total_sum += arr[i]; 
    }
    
    for (int i = 1; i < arr.size(); i++) {
        cur_min = min(cur_min + arr[i], arr[i]);
        overall_min = min(overall_min, cur_min);
    }
    
    if (total_sum == overall_min) {
        return overall_max;
    }
    
    return max(overall_max, total_sum - overall_min);
}
int main(){
  int n=5;
  
  vector<int>arr(n);
  arr[]= {1,2,3,4,5};
  std::cout << getmax(arr) << std::endl;
}