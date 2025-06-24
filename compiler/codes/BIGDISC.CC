#include <bits/stdc++.h>
using namespace std;

#define ll long long
const int N = 1050;
vector<ll> graph[N];

bool intersecting(array<ll, 3>& c1, array<ll, 3>& c2) {
    return (c1[2] + c2[2]) * (c1[2] + c2[2]) >= (c1[0] - c2[0]) * (c1[0] - c2[0]) + (c1[1] - c2[1]) * (c1[1] - c2[1]);
}

vector<int> bfs(int src) {
    vector<int> vis(N, 0);
    queue<int> q;
    q.push(src);
    vis[src] = 1;

    while (!q.empty()) {
        int vertex = q.front();
        q.pop();

        for (auto& child : graph[vertex]) {
            if (!vis[child]) {
                vis[child] = 1;
                q.push(child);
            }
        }
    }
    return vis;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int tc;
    cin >> tc;
    while (tc--) {
      ll N, M, circle_cnt;
      cin >> N >> M >> circle_cnt;
      for (int i = 1; i <= circle_cnt + 10; i++) {
          graph[i].clear();
      }
      
      vector<array<ll, 3>> circles(circle_cnt + 1);
      for (int i = 1; i <= circle_cnt; i++) {
        //           CX,             CY,              RADIUS
          cin >> circles[i][0] >> circles[i][1] >> circles[i][2];
      }
      
      for (int i = 1; i < circle_cnt; i++) {
          for (int j = i + 1; j <=circle_cnt ; j++) {
              if (intersecting(circles[i], circles[j])) {
                  graph[i].push_back(j);
                  graph[j].push_back(i);
              }
          }
          // circle ke centre ka Y cordinate +r >=m matlab intersect y=m
          if (circles[i][1] + circles[i][2] >= M) {
              graph[i].push_back(circle_cnt + 1);
              graph[circle_cnt + 1].push_back(i);
          }
           // circle ke centre ka X cordinate +r >=n matlab intersect x=n
          if (circles[i][0] + circles[i][2] >= N) {
              graph[i].push_back(circle_cnt + 2);
              graph[circle_cnt + 2].push_back(i);
          }
          // circle ke centre ka Y cordinate -r <=0 matlab intersect y=0
          if (circles[i][1] - circles[i][2] <= 0) {
              graph[i].push_back(circle_cnt + 3);
              graph[circle_cnt + 3].push_back(i);
          }
          // circle ke centre ka X cordinate -r <=0 matlab intersect x=0
          if (circles[i][0] - circles[i][2] <= 0) {
              graph[i].push_back(circle_cnt + 4);
              graph[circle_cnt + 4].push_back(i);
          }
          
          if (circles[i][1] <= circles[i][2]) {
              graph[i].push_back(circle_cnt + 3);
              graph[circle_cnt + 3].push_back(i);
          }
          if (circles[i][0] <= circles[i][2]) {
              graph[i].push_back(circle_cnt + 4);
              graph[circle_cnt + 4].push_back(i);
          }
      }

      vector<int> vis1 = bfs(circle_cnt + 1);
      vector<int> vis2 = bfs(circle_cnt + 2);

      if (vis1[circle_cnt + 3] || vis1[circle_cnt + 4] || vis2[circle_cnt + 3] || vis2[circle_cnt + 4]) {
          cout << "NO" << endl;
      } else {
          cout << "YES" << endl;
      }
    }

    return 0;
}
