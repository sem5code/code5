INF = 999

n = int(input("Enter number of nodes: "))

graph = []
print("Enter the cost matrix (use 999 for infinity):")
for i in range(n):
    row = list(map(int, input(f"Row {i+1}: ").split()))
    graph.append(row)

distance = [[INF] * n for _ in range(n)]

for i in range(n):
    for j in range(n):
        distance[i][j] = graph[i][j]

for k in range(n):
    for i in range(n):
        for j in range(n):
            if distance[i][j] > distance[i][k] + distance[k][j]:
                distance[i][j] = distance[i][k] + distance[k][j]

print("\nFinal Distance Vector Routing Table:")
for i in range(n):
    print(f"From Node {i+1}: ", distance[i])

'''Enter number of nodes: 3
Enter the cost matrix (use 999 for infinity):
Row 1: 0 2 999
Row 2: 2 0 3
Row 3: 999 3 0
Final Distance Vector Routing Table:
From Node 1: [0, 2, 5]
From Node 2: [2, 0, 3]
From Node 3: [5, 3, 0]
'''
print("\n")

import heapq

def dijkstra(graph, start):
    n = len(graph)
    visited = [False] * n
    distance = [float('inf')] * n
    distance[start] = 0
    pq = [(0, start)]  

    while pq:
        dist, current = heapq.heappop(pq)

        if visited[current]:
            continue

        visited[current] = True

        for neighbor in range(n):
            if graph[current][neighbor] != 999:  
                new_dist = distance[current] + graph[current][neighbor]
                if new_dist < distance[neighbor]:
                    distance[neighbor] = new_dist
                    heapq.heappush(pq, (new_dist, neighbor))

    return distance

n = int(input("Enter number of nodes: "))
graph = []
print("Enter the cost matrix (999 for no link):")
for i in range(n):
    row = list(map(int, input(f"Row {i+1}: ").split()))
    graph.append(row)

for i in range(n):
    print(f"\nShortest paths from Node {i+1}:")
    result = dijkstra(graph, i)
    for j in range(n):
        print(f"To Node {j+1}: {result[j]}")

'''Enter number of nodes: 3
Enter the cost matrix (999 for no link):
Row 1: 0 2 999
Row 2: 2 0 3
Row 3: 999 3 0
Shortest paths from Node 1:
To Node 1: 0
To Node 2: 2
To Node 3: 5
Shortest paths from Node 2:
To Node 1: 2
To Node 2: 0
To Node 3: 3
Shortest paths from Node 3:
To Node 1: 5
To Node 2: 3
To Node 3: 0
'''
