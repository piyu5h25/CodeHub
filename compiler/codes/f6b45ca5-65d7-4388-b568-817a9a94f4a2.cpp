#include <bits/stdc++.h>
using namespace std;

int main() {
    string final_str= 'chakerrank';
    // cin >> final_str;
    int num_opr =3;
    // cin >> num_opr;

    string initial = final_str;
    for (int i = num_opr; i >= 1; i--) {
        reverse(initial.begin(), initial.begin() + i);
    }

    cout << initial << endl;
    return 0;
}
